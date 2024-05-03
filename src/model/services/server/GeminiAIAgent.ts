import { writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

import {
  GoogleGenerativeAI,
  ChatSession,
  FunctionDeclaration,
  FunctionDeclarationSchema,
  FunctionDeclarationSchemaType,
  FunctionResponse,
  Part,
  GenerativeModel,
  type GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
// @ts-ignore
import { GoogleAIFileManager } from "@google/generative-ai/files";

import { schemas } from "../../schemas";
import { AIRequest, AIResponse, FunctionCallSchema } from "../../types/ai";
import { JSONSchemaTypeName } from "../../types/jsonSchema";
import { AIHistoryItem } from "../../types/aiChatService";
import type { Session } from "../../types/session";
import { AIError } from "../../errors/AI";
import { config } from "../config";
import { AIAgent } from "./AIAgent";

type FileManager = typeof GoogleAIFileManager;

export class GeminiAIAgent extends AIAgent {
  #model: string;
  #sessions = new Map<string, ChatSession>();
  #clients = new Map<string, { model: GenerativeModel; files: FileManager }>();

  constructor(model = config.AI_MODEL_NAME) {
    super("gemini");
    this.#model = model;
  }

  #handleError = (error: GoogleGenerativeAIFetchError) => {
    if (error.errorDetails?.[0]?.reason === "API_KEY_INVALID") {
      throw new AIError("API key is invalid", "API_KEY_INVALID");
    }
    throw new AIError(error.message, "unknown", error.errorDetails);
  };

  #getOrCreateClient(session: Session) {
    if (!this.#clients.has(session.token)) {
      this.#clients.set(session.token, {
        model: new GoogleGenerativeAI(session.token).getGenerativeModel(
          {
            model: this.#model,
          },
          { apiVersion: "v1beta" }
        ),
        files: new GoogleAIFileManager(session.token),
      });
    }
    return this.#clients.get(session.token)!;
  }

  #createChatSession(
    session: Session,
    history = config.AI_SYSTEM_PROMPT
  ): ChatSession {
    const generationConfig = {
      temperature: 0,
      topK: 1,
      topP: 1,
      maxOutputTokens: 10000,
    };

    const toGeminiSchemaType: Record<
      JSONSchemaTypeName,
      FunctionDeclarationSchemaType | undefined
    > = {
      integer: FunctionDeclarationSchemaType.INTEGER,
      string: FunctionDeclarationSchemaType.STRING,
      object: FunctionDeclarationSchemaType.OBJECT,
      array: FunctionDeclarationSchemaType.ARRAY,
      boolean: FunctionDeclarationSchemaType.BOOLEAN,
      number: FunctionDeclarationSchemaType.NUMBER,
      null: undefined,
    };
    const mapProps = (
      props: FunctionCallSchema["input_schema"]["properties"]
    ): FunctionDeclarationSchema["properties"] => {
      return props
        ? Object.entries(props).reduce((acc, [key, value]) => {
            return {
              ...acc,
              [key as string]: Object.assign({}, value, {
                type: toGeminiSchemaType[value.type as JSONSchemaTypeName],
                properties: mapProps(value.properties),
              }),
            };
          }, {})
        : {};
    };

    const client = this.#getOrCreateClient(session);

    const chat = client.model.startChat({
      generationConfig,
      safetySettings: config.AI_CHAT_SAFETY_SETTINGS,
      history: [...history],
      tools: [
        {
          functionDeclarations: schemas.map(
            (schema): FunctionDeclaration => ({
              name: schema.name,
              description: schema.description,
              parameters: {
                type: FunctionDeclarationSchemaType.OBJECT,
                required: schema.input_schema.required,
                properties: mapProps(schema.input_schema.properties),
              },
            })
          ),
        },
      ],
    });

    return chat;
  }

  async getHistory(session: Session) {
    if (this.#sessions.has(session.sessionId)) {
      const chatSession = this.#sessions.get(session.sessionId);
      if (chatSession) {
        return (await chatSession.getHistory())
          .slice(2)
          .filter(
            (message) =>
              message.role !== "function" &&
              !message.parts.some((part) => part.functionCall)
          )
          .map(
            (message): AIHistoryItem => ({
              parts: message.parts
                .filter((part) => part.text)
                .map((part) => ({
                  text: part.text!,
                })),
              role: message.role,
            })
          );
      }
    }
    return [];
  }

  async clearHistory(session: Session): Promise<void> {
    this.#sessions.set(session.sessionId, this.#createChatSession(session));
  }

  async sendMessage(input: AIRequest, session: Session): Promise<AIResponse> {
    if (!this.#sessions.has(session.sessionId)) {
      this.#sessions.set(session.sessionId, this.#createChatSession(session));
    }

    let fileResult;

    if (input.type === "text" && input.file) {
      const fileName = `temp-${Math.random().toString(36).substring(2, 15)}`;
      const tempFilename = join(tmpdir(), `${fileName}.jpg`);
      await writeFile(tempFilename, Buffer.from(input.file), { flag: "wx" });
      const { files } = this.#getOrCreateClient(session);

      fileResult = await files
        .uploadFile(tempFilename, {
          mimeType: "image/jpeg",
          name: fileName,
          displayName: fileName,
        })
        .catch(this.#handleError);
    }

    const chatSession = this.#sessions.get(session.sessionId);

    if (chatSession) {
      const message =
        input.type === "text"
          ? [
              { text: input.text },
              ...(fileResult
                ? [
                    {
                      fileData: {
                        mimeType: fileResult.file.mimeType,
                        fileUri: fileResult.file.uri,
                      },
                    },
                  ]
                : []),
            ]
          : input.functionResponses.map(
              (functionResponse): { functionResponse: FunctionResponse } => ({
                functionResponse: {
                  name: functionResponse.name,
                  response: functionResponse.response,
                },
              })
            );
      const result = await chatSession
        .sendMessage(message)
        .catch(this.#handleError);
      const response = result.response;
      const responseText = response.text();
      const responseJson = JSON.parse(JSON.stringify(response));
      const functionCalls = response.functionCalls() || [
        responseJson?.candidates?.[0]?.content?.parts?.find?.(
          (part: any) => part.functionCall
        )?.functionCall,
      ];

      const responseParts = responseJson?.candidates?.[0]?.content?.parts;
      if (responseParts?.some((part: any) => part.functionCall)) {
        const newParts = responseParts.filter((part: any) => part.functionCall);
        const history = await this.#sessions
          .get(session.sessionId)
          ?.getHistory();
        const latestHistoryItem = history?.at(-1);
        if (latestHistoryItem) {
          latestHistoryItem.parts = newParts as Part[];
          this.#sessions.set(
            session.sessionId,
            this.#createChatSession(session, history)
          );
        }
      }

      if (functionCalls.some((call) => !!call)) {
        return {
          type: "function_call",
          calls: functionCalls,
        };
      }

      if (!responseParts?.length) {
        const history = await this.#sessions
          .get(session.sessionId)
          ?.getHistory();
        if (history) {
          history.push(
            { role: "user", parts: [message as unknown as Part] },
            { role: "model", parts: [{ text: "done!" }] }
          );
          this.#sessions.set(
            session.sessionId,
            this.#createChatSession(session, history)
          );
        }
      }

      return {
        type: "text",
        text: responseText ?? "done!",
      };
    }

    return {
      type: "empty",
    };
  }
}

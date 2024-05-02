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
} from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/files";

import { schemas } from "../../schemas";
import { AIRequest, AIResponse, FunctionCallSchema } from "../../types/ai";
import { JSONSchemaTypeName } from "../../types/jsonSchema";
import { AIHistoryItem } from "../../types/aiChatService";
import { config } from "../config";
import { AIAgent } from "./AIAgent";

export class GeminiAIAgent extends AIAgent {
  #fileManager = new GoogleAIFileManager(config.AI_API_KEY);
  #model = new GoogleGenerativeAI(config.AI_API_KEY).getGenerativeModel(
    {
      model: config.AI_MODEL_NAME,
    },
    { apiVersion: "v1beta" }
  );
  #sessions = new Map<string, ChatSession>();

  constructor() {
    super("gemini");
  }

  #createChatSession(history = config.AI_SYSTEM_PROMPT): ChatSession {
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

    const chat = this.#model.startChat({
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

  async getHistory(sessionId: string) {
    if (this.#sessions.has(sessionId)) {
      const session = this.#sessions.get(sessionId);
      if (session) {
        return (await session.getHistory())
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

  async clearHistory(sessionId: string): Promise<void> {
    this.#sessions.set(sessionId, this.#createChatSession());
  }

  async sendMessage(input: AIRequest, sessionId: string): Promise<AIResponse> {
    if (!this.#sessions.has(sessionId)) {
      this.#sessions.set(sessionId, this.#createChatSession());
    }

    let fileResult;

    if (input.type === "text" && input.file) {
      const fileName = `temp-${Math.random().toString(36).substring(2, 15)}`;
      const tempFilename = join(tmpdir(), `${fileName}.jpg`);
      console.log("path", tempFilename);
      await writeFile(tempFilename, Buffer.from(input.file), { flag: "wx" });
      console.log("file was created");

      fileResult = await this.#fileManager.uploadFile(tempFilename, {
        mimeType: "image/jpeg",
        name: fileName,
        displayName: fileName,
      });
      console.log("Result", fileResult);
    }

    const session = this.#sessions.get(sessionId);

    console.log(await this.getHistory(sessionId));
    console.log(JSON.stringify((await this.getHistory(sessionId)).at(-1)));

    if (session) {
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

      console.log(
        "[Server current request]",
        input.type,
        JSON.stringify(message)
      );

      const result = await session.sendMessage(message);
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
        const history = await this.#sessions.get(sessionId)?.getHistory();
        const latestHistoryItem = history?.at(-1);
        if (latestHistoryItem) {
          latestHistoryItem.parts = newParts as Part[];
          this.#sessions.set(sessionId, this.#createChatSession(history));
        }
      }

      console.log("[Server Response]", JSON.stringify(response));
      console.log(
        "[Server Response function call]",
        JSON.stringify(functionCalls || "no function")
      );

      if (functionCalls.some((call) => !!call)) {
        return {
          type: "function_call",
          calls: functionCalls,
        };
      }

      if (!responseParts?.length) {
        const history = await this.#sessions.get(sessionId)?.getHistory();
        if (history) {
          history.push(
            { role: "user", parts: [message as unknown as Part] },
            { role: "model", parts: [{ text: "done!" }] }
          );
          this.#sessions.set(sessionId, this.#createChatSession(history));
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

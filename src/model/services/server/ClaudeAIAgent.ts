import Anthropic from "@anthropic-ai/sdk";

import { schemas } from "../../schemas";
import { AIRequest, AIResponse, FunctionCall } from "../../types/ai";
import { AIHistory } from "../../types/aiChatService";
import { AIAgent } from "./AIAgent";
import { config } from "../config";

type ToolsBetaMessage = Anthropic.Beta.Tools.Messages.ToolsBetaMessage;
type TextBlockParam = Anthropic.Messages.TextBlockParam;
type ToolsBetaMessageParam =
  Anthropic.Beta.Tools.Messages.ToolsBetaMessageParam;

export class ClaudeAIAgent extends AIAgent {
  #model = new Anthropic({ apiKey: config.CLAUDE_API_KEY });
  #sessions = new Map<string, ToolsBetaMessageParam[]>();
  #lastToolUseId = "";

  constructor() {
    super("claude");
  }

  public async sendMessage(
    input: AIRequest,
    sessionId: string
  ): Promise<AIResponse> {
    const session = this.#getSession(sessionId);
    const message = this.#convert(input);

    const result = await session.sendMessage(message);
    const { functionCalls, text } = this.#parse(result);

    console.log("RESULT", JSON.stringify(result, null, 2));

    if (functionCalls && functionCalls.length > 0) {
      return {
        type: "function_call",
        calls: functionCalls,
      };
    }

    if (
      ["end_turn", "stop_sequence", "max_tokens"].includes(result.stop_reason!)
    ) {
      // this.#sessions.set(
      //   sessionId,
      //   this.#getHistoryWithoutFunctionCalls(sessionId)
      // );
    }

    return {
      type: "text",
      text,
    };
  }

  public async getHistory(sessionId: string): Promise<AIHistory> {
    return this.#getHistoryWithoutFunctionCalls(sessionId).map((message) => {
      return {
        role: message.role === "user" ? "user" : "model",
        parts: (typeof message.content === "string"
          ? [{ text: message.content }]
          : message.content
        ).map((content) => ({
          text: (content as TextBlockParam).text,
        })),
      };
    });
  }

  public async clearHistory(sessionId: string): Promise<void> {
    this.#sessions.set(sessionId, []);
  }

  #getSession(sessionId: string) {
    if (!this.#sessions.has(sessionId)) {
      this.#sessions.set(sessionId, []);
    }
    const history = this.#sessions.get(sessionId)!;
    const model = this.#model;
    return {
      async sendMessage(message: ToolsBetaMessageParam[]) {
        const messages: ToolsBetaMessageParam[] = history;
        messages.push(...message);

        console.log("SEND >>>>", JSON.stringify(messages));

        const response = await model.beta.tools.messages.create({
          model: config.CLAUDE_MODEL_NAME,
          // max_tokens: 4000,
          max_tokens: 2000,
          temperature: 0,
          system:
            "You are MiroBot, AI assistant and you help others to work with miro boards, control them, fetch information from the board, create new elements and so on. " +
            "Try to answer shortly and clearly." +
            "Use actual item ids, if you want to remove or update them. DO NOT USE INEXISTENT IDs, retrieve them from the board. If you do not know ids or asked to work with previously mentioned items USE THE GET FUNCTION to get the actual ids of the items." +
            "If you need to do some operation based on the content of the board, USE THE GET FUNCTION to get the information about board before actual operation." +
            "In case of enums use the exact values from the enum." +
            "After function call do not mention the code of the function, just describe the result of the function call, as you did it. Also if function call create something return ids of created items." +
            "Position of all items on the board is calculated based on the center of the item." +
            "Coordinates system: positive x is to the right, positive y is down." +
            "Do not overlap widgets, place them with some space between each other." +
            "Do not mention names of the functions in the text, use the tools section to call them.",
          messages,
          tools: schemas,
        });

        // Exclude images
        message.forEach((m) => {
          if (typeof m.content !== "string") {
            m.content = m.content.filter((part) => part.type !== "image");
          }
        });

        history.push({
          role: "assistant",
          content: response.content,
        });
        return response;
      },
    };
  }

  #getHistoryWithoutFunctionCalls(sessionId: string) {
    const history = this.#sessions.get(sessionId) || [];
    return history.filter(
      (historyItem) =>
        typeof historyItem.content === "string" ||
        historyItem.content.every(
          (item) => !["tool_result", "tool_use"].includes(item.type)
        )
    );
  }

  #parse(message: ToolsBetaMessage) {
    return message.content.reduce<{
      functionCalls: FunctionCall[];
      text: string;
    }>(
      (acc, item) => {
        if (item.type === "tool_use") {
          this.#lastToolUseId = item.id;
          acc.functionCalls.push({
            id: item.id,
            name: item.name,
            args: item.input as any,
          });
        }
        if (item.type === "text") {
          acc.text += item.text;
        }
        return acc;
      },
      { functionCalls: [], text: "" }
    );
  }

  #convert(input: AIRequest): ToolsBetaMessageParam[] {
    if (input.type === "text") {
      return [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: input.text,
            },
            ...(input.file
              ? [
                  {
                    type: "image" as "image",
                    source: {
                      type: "base64" as "base64",
                      media_type: "image/jpeg" as "image/jpeg",
                      data: Buffer.from(input.file).toString("base64"),
                    },
                  },
                ]
              : []),
          ],
        },
      ];
    }
    return [
      {
        role: "user",
        content: [
          {
            tool_use_id: this.#lastToolUseId,
            type: "tool_result",
            content: [
              {
                type: "text",
                text: JSON.stringify(input.functionResponses),
              },
            ],
          },
        ],
      },
    ];
  }
}

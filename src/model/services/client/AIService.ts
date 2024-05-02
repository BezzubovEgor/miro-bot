import {
  cleanupChatSession,
  getHistory,
  sendMessage,
} from "../../../app/actions";
import { AIChatService, AIHistory } from "../../types/aiChatService";
import { CommandsRegistry } from "./CommandsRegistry";
import { AgentSelector } from "./AgentSelector";

type Unsubscribe = () => void;

export class AIServiceClass implements AIChatService {
  #historySubscriptions: ((history: AIHistory) => void)[] = [];

  constructor() {}

  async sendMessage(input: string, file?: Uint8Array) {
    const currentHistory = await this.getHistory();
    const agent = AgentSelector.getSelectedAgent();
    this.#emitHistory([
      ...currentHistory,
      { role: "user", parts: [{ text: input }] },
    ]);
    try {
      let response = await sendMessage(
        {
          type: "text",
          text: input,
          file,
        },
        agent
      );

      while (response.type === "function_call") {
        const functionCalls = response.calls;
        response = await sendMessage(
          {
            type: "function_response",
            functionResponses: await Promise.all(
              functionCalls.map(async (call) => {
                const command = CommandsRegistry.get(call.name);
                const result = await command?.(call.args).catch((error) =>
                  JSON.stringify(error)
                );
                return {
                  id: "",
                  name: call.name,
                  response: {
                    name: call.name,
                    content: command
                      ? result
                      : "Error: such function does not exist.",
                  },
                };
              })
            ),
          },
          agent
        );
      }

      if (response.type === "empty") {
        return "Sorry, I don't know how to respond to that.";
      }
      this.#emitHistory(await this.getHistory());
      return response.text;
    } catch (error) {
      await miro.board.notifications.showError(
        "Sorry, your request could not be processed. Please try again."
      );
      console.error(error);
      await this.clear();
      this.#emitHistory(await this.getHistory());
      return "";
    }
  }

  async getHistory() {
    return getHistory(AgentSelector.getSelectedAgent());
  }

  async clear() {
    await cleanupChatSession(AgentSelector.getSelectedAgent());
    return this.#emitHistory(await this.getHistory());
  }

  onHistoryUpdate(cb: (history: AIHistory) => void): Unsubscribe {
    this.#historySubscriptions.push(cb);
    return () => {
      this.#historySubscriptions = this.#historySubscriptions.filter(
        (item) => item !== cb
      );
    };
  }

  #emitHistory(history: AIHistory) {
    this.#historySubscriptions.forEach((cb) => cb(history));
  }
}

export const AIService = new AIServiceClass();

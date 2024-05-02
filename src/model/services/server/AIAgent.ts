import { AIRequest, AIResponse } from "../../types/ai";
import { AIHistory } from "../../types/aiChatService";

export abstract class AIAgent {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  abstract sendMessage(
    input: AIRequest,
    sessionId: string
  ): Promise<AIResponse>;

  abstract getHistory(sessionId: string): Promise<AIHistory>;

  abstract clearHistory(sessionId: string): Promise<void>;
}

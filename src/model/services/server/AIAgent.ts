import { AIRequest, AIResponse } from "../../types/ai";
import { AIHistory } from "../../types/aiChatService";
import type { Session } from "../../types/session";

export abstract class AIAgent {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  abstract sendMessage(input: AIRequest, session: Session): Promise<AIResponse>;

  abstract getHistory(session: Session): Promise<AIHistory>;

  abstract clearHistory(session: Session): Promise<void>;
}

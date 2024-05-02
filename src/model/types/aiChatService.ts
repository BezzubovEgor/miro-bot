export type AIHistoryPart = {
  text: string;
};

export type AIHistoryItem = {
  role: string;
  parts: AIHistoryPart[];
};

export type AIHistory = AIHistoryItem[];

export interface AIChatService {
  sendMessage(input: string): Promise<string>;
  getHistory(): Promise<AIHistory>;
}

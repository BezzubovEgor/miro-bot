"use server";

import { ClaudeAIAgent } from "../model/services/server/ClaudeAIAgent";
import { GeminiAIAgent } from "../model/services/server/GeminiAIAgent";
import { AIRequest } from "../model/types/ai";
import { getOrCreateSessionId } from "../utils/server/session";

const agents = {
  claude: new ClaudeAIAgent(),
  gemini: new GeminiAIAgent(),
};

function getAgent(agent?: keyof typeof agents) {
  return agent && agent in agents ? agents[agent] : agents["gemini"];
}

export async function sendMessage(
  input: AIRequest,
  agent?: keyof typeof agents
) {
  return getAgent(agent).sendMessage(input, await getOrCreateSessionId());
}

export async function getHistory(agent?: keyof typeof agents) {
  return getAgent(agent).getHistory(await getOrCreateSessionId());
}

export async function cleanupChatSession(agent?: keyof typeof agents) {
  return getAgent(agent).clearHistory(await getOrCreateSessionId());
}

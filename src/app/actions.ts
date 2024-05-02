"use server";

import { RedirectType, redirect } from "next/navigation";

import { GeminiAIAgent } from "../model/services/server/GeminiAIAgent";
import { AIRequest } from "../model/types/ai";
import { getSession, createSession } from "../utils/server/session";
import { AIError } from "../model/errors/AI";

const agents = {
  gemini: new GeminiAIAgent(),
  "gemini-1.0": new GeminiAIAgent("gemini-1.0-pro-latest"),
  "gemini-1.5": new GeminiAIAgent("gemini-1.5-pro-latest"),
};

function getAgent(agent?: keyof typeof agents) {
  return agent && agent in agents ? agents[agent] : agents["gemini"];
}

function handleAIError(error: Error) {
  if (error instanceof AIError) {
    if (error.cause === "API_KEY_INVALID") {
      return redirect(
        "/login?message=Invalid API key was provided!",
        RedirectType.replace
      );
    }
  }
  throw error;
}

export async function auth(token: string, saveOnDevice = false) {
  createSession(token, saveOnDevice);
  redirect("/", RedirectType.replace);
}

export async function sendMessage(
  input: AIRequest,
  agent?: keyof typeof agents
) {
  return await getAgent(agent)
    .sendMessage(input, await getSession())
    .catch(handleAIError);
}

export async function getHistory(agent?: keyof typeof agents) {
  return await getAgent(agent)
    .getHistory(await getSession())
    .catch(handleAIError);
}

export async function cleanupChatSession(agent?: keyof typeof agents) {
  return getAgent(agent)
    .clearHistory(await getSession())
    .catch(handleAIError);
}

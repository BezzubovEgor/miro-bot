"use server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import type { Session } from "../../model/types/session";

const sessions = new Map<string, string>();

export async function createSession(
  token: string,
  saveOnDevice = false
): Promise<Session> {
  const newSessionId = uuidv4();
  cookies().set("ai.session", newSessionId, {
    sameSite: "none",
    secure: true,
  });
  if (saveOnDevice) {
    cookies().set("ai.session:token", token, {
      sameSite: "none",
      secure: true,
    });
  } else {
    sessions.set(newSessionId, token);
  }

  return {
    sessionId: newSessionId,
    token,
  };
}

export async function isAuthorized() {
  try {
    const session = await getSession();
    return !!session;
  } catch {
    return false;
  }
}

export async function getSession(): Promise<Session> {
  const sessionId = cookies().get("ai.session");
  const serverToken = sessionId?.value && sessions.get(sessionId?.value);
  const clientToken = cookies().get("ai.session:token")?.value;
  const token = serverToken || clientToken;

  if (!sessionId || !token) {
    throw new Error("Can't find correct token!");
  }
  return {
    sessionId: sessionId.value,
    token,
  };
}

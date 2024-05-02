"use server";
import { cookies } from "next/headers";

export async function getOrCreateSessionId() {
  const sessionId = cookies().get("ai.session");
  if (sessionId) {
    return sessionId.value;
  }
  const newSessionId = `${performance.now()}`;
  cookies().set("ai.session", `${newSessionId}`, {
    sameSite: "none",
    secure: true,
  });
  return newSessionId;
}

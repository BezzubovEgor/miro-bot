export class AIError extends Error {
  cause: "unknown" | "API_KEY_INVALID";
  details?: unknown;

  constructor(
    message: string,
    cause: "unknown" | "API_KEY_INVALID",
    details?: unknown
  ) {
    super(message);
    this.name = "AIError";
    this.cause = cause;
    this.details = details;
  }
}

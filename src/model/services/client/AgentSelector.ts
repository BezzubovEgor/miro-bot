const DEFAULT_AGENT = "gemini";

class AgentSelectorClass {
  private selectedAgentKey = "selectedAgent";

  constructor() {}

  getSelectedAgent(): "gemini" | "claude" {
    return (
      (localStorage.getItem(this.selectedAgentKey) as "gemini" | "claude") ??
      DEFAULT_AGENT
    );
  }

  setSelectedAgent(model: "gemini" | "claude"): void {
    localStorage.setItem(this.selectedAgentKey, model);
  }
}

export const AgentSelector = new AgentSelectorClass();

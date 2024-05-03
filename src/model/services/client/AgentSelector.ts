const DEFAULT_AGENT = "gemini-1.0";

export type Agent = "gemini" | "gemini-1.0" | "gemini-1.5";

class AgentSelectorClass {
  private selectedAgentKey = "selectedAgent";

  constructor() {}

  getSelectedAgent(): Agent {
    return (
      (localStorage.getItem(this.selectedAgentKey) as Agent) ?? DEFAULT_AGENT
    );
  }

  setSelectedAgent(model: Agent): void {
    localStorage.setItem(this.selectedAgentKey, model);
  }
}

export const AgentSelector = new AgentSelectorClass();

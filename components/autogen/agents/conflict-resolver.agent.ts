import { Agent } from "../core/agent";
import { GeminiClient } from "../gemini.client";

export class ConflictResolverAgent extends Agent {
  constructor(private gemini: GeminiClient) {
    super("ConflictResolver", {
      expertise: "Conflict detection and resolution",
      role: "Identify and resolve resource allocation conflicts"
    });
  }

  async process(input: string) {
    const prompt = `As conflict resolver, analyze conflicts: ${input}
                   Suggest resolutions considering project timelines and resource availability. Output JSON format.`;
                   
    return this.gemini.processPrompt(prompt);
  }
}
import { Agent } from "../core/agent";
import { GeminiClient } from "../gemini.client";

export class ProjectManagerAgent extends Agent {
  constructor(private gemini: GeminiClient) {
    super("ProjectManager", {
      expertise: "Project planning and task decomposition",
      role: "Break down project goals into executable tasks"
    });
  }

  async process(input: string) {
    const prompt = `As project manager, decompose these goals: ${input} 
                   into tasks with deadlines. Output JSON format.`;
                   
    return this.gemini.processPrompt(prompt);
  }
}
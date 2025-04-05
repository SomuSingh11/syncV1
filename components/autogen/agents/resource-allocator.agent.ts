import { Agent } from "../core/agent";
import { GeminiClient } from "../gemini.client";

export class ResourceAllocatorAgent extends Agent {
  constructor(private gemini: GeminiClient) {
    super("ResourceAllocator", {
      expertise: "Resource allocation optimization",
      role: "Manage and allocate shared resources between departments"
    });
  }

  async process(input: string) {
    const prompt = `As resource allocator, optimize allocation for: ${input}
                   Consider availability and department priorities. Output JSON format.`;
                   
    return this.gemini.processPrompt(prompt);
  }
}
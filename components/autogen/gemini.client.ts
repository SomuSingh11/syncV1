import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiClient {
  private model: GoogleGenerativeAI;
  
  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    this.model = genAI;
  }

  async processPrompt(prompt: string) {
    try {
      const model = this.model.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Error processing request";
    }
  }
}
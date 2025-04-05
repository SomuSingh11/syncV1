// Fix 1: Update imports to use local paths
import { GroupChat, GroupChatManager } from "./core/group-chat";
import { GeminiClient } from "./gemini.client";
import { ProjectManagerAgent } from "./agents/project-manager.agent";
import { ResourceAllocatorAgent } from "./agents/resource-allocator.agent";
import { ConflictResolverAgent } from "./agents/conflict-resolver.agent";

interface CollaborationConfig {
  departments: string[];
  projectGoals: string[];
  resources: string[];
}

export class AutogenSystem {
  private groupChat: GroupChat;
  private gemini: GeminiClient;
  
  constructor(private config: CollaborationConfig) {
    this.gemini = new GeminiClient(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
    this.groupChat = new GroupChat();
    this.initializeAgents();
  }

  private initializeAgents() {
    const agents = [
      new ProjectManagerAgent(this.gemini),
      new ResourceAllocatorAgent(this.gemini),
      new ConflictResolverAgent(this.gemini)
    ];
    
    agents.forEach(agent => 
      this.groupChat.registerAgent(agent)
    );
  }

  async initiateCollaboration() {
    const manager = new GroupChatManager(this.groupChat);
    const initialPrompt = this.createInitialPrompt();
    return manager.startConversation(initialPrompt);
  }

  private createInitialPrompt() {
    return `New collaboration between ${this.config.departments.join(", ")} 
            for project goals: ${this.config.projectGoals.join(", ")} 
            with resources: ${this.config.resources.join(", ")}`;
  }
}
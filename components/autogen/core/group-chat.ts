type Message = {
  sender: string;
  content: string;
};

export class GroupChat {
  private agents: { name: string; process: (message: string) => Promise<string> }[] = [];
  private messageHistory: Message[] = [];

  registerAgent(agent: { name: string; process: (message: string) => Promise<string> }) {
    this.agents.push(agent);
  }

  async sendMessage(sender: { name: string; process: (message: string) => Promise<string> }, message: string) {
    this.messageHistory.push({ sender: sender.name, content: message });
    return this.broadcastMessage(message);
  }

  private async broadcastMessage(message: string) {
    const responses = await Promise.all(
      this.agents.map(async agent => ({
        sender: agent.name,
        response: await agent.process(message)
      }))
    );
    
    responses.forEach(res => {
      this.messageHistory.push({ sender: res.sender, content: res.response });
    });
    
    return this.messageHistory;
  }
}

export class GroupChatManager {
  constructor(private groupChat: GroupChat) {}

  async startConversation(initialPrompt: string) {
    return this.groupChat.sendMessage(
      { name: "System", process: async () => "" } as { name: string; process: (message: string) => Promise<string> },
      initialPrompt
    );
  }
}
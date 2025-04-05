export abstract class Agent {
  constructor(
    public readonly name: string,
    public readonly config: {
      expertise: string;
      role: string;
    }
  ) {}

  abstract process(input: string): Promise<string>;
}
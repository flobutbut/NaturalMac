export interface AIService {
  generateCommand(input: string): Promise<string>;
}

export interface AIResponse {
  command: string;
  type: string;
  confidence: number;
} 
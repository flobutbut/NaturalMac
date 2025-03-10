import { AI_CONFIG } from '@/config/ai.config'
import type { AIService } from '@/types/ai'

export class ClaudeService implements AIService {
  private apiKey: string;

  constructor() {
    this.apiKey = AI_CONFIG.apiKey;
    if (!this.apiKey) {
      throw new Error('API Key non configurée');
    }
  }

  async generateCommand(input: string): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          max_tokens: AI_CONFIG.maxTokens,
          messages: [
            {
              role: 'system',
              content: AI_CONFIG.basePrompt
            },
            {
              role: 'user',
              content: input
            }
          ],
          temperature: AI_CONFIG.temperature
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${data.error?.message || 'Erreur inconnue'}`);
      }

      return data.content[0].text;
    } catch (error) {
      console.error('Erreur lors de la génération de la commande:', error);
      throw error;
    }
  }
} 
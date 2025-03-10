import { AI_CONFIG } from '@/config/ai.config'
import type { AIService, AIResponse } from '@/types/ai'
import type { CommandType } from '@/types/command'

export class OpenAIService implements AIService {
  private apiKey: string;

  constructor() {
    this.apiKey = AI_CONFIG.apiKey;
    if (!this.apiKey) {
      throw new Error('API Key non configurée');
    }
  }

  async generateCommand(input: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: [
            { role: 'system', content: AI_CONFIG.basePrompt },
            { role: 'user', content: input }
          ],
          temperature: AI_CONFIG.temperature,
          max_tokens: AI_CONFIG.maxTokens
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${data.error?.message || 'Erreur inconnue'}`);
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Erreur lors de la génération de la commande:', error);
      throw error;
    }
  }
} 
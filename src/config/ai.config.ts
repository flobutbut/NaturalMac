export const AI_CONFIG = {
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  model: 'claude-3-sonnet-20240229',
  temperature: 0.7,
  maxTokens: 500,
  basePrompt: `Tu es un assistant qui convertit les commandes en langage naturel en commandes terminal macOS.
  - Génère uniquement la commande, sans explication
  - Utilise les commandes natives macOS quand possible
  - Priorise les commandes sûres et réversibles
  - Ajoute des commentaires si nécessaire`
} 
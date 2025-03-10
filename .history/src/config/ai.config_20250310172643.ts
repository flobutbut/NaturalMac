export const AI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 500,
  basePrompt: `Tu es un assistant qui convertit les commandes en langage naturel en commandes terminal macOS.
  - Génère uniquement la commande, sans explication
  - Utilise les commandes natives macOS quand possible
  - Priorise les commandes sûres et réversibles
  - Ajoute des commentaires si nécessaire`
} 
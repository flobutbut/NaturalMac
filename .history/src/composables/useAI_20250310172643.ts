import { ref } from 'vue'
import { OpenAIService } from '@/services/ai/openAIService'
import type { Command } from '@/types/command'
import { CommandStatus } from '@/types/command'
import { useCommandStore } from '@/stores/commandStore'

export function useAI() {
  const aiService = new OpenAIService()
  const isProcessing = ref(false)
  const commandStore = useCommandStore()

  const generateCommand = async (command: Command) => {
    isProcessing.value = true
    
    try {
      commandStore.updateCommand(command.id, {
        status: CommandStatus.GENERATING
      })

      const generatedCommand = await aiService.generateCommand(command.input)

      commandStore.updateCommand(command.id, {
        generatedCommand,
        status: CommandStatus.CONFIRMING
      })

      return generatedCommand
    } catch (error) {
      commandStore.updateCommand(command.id, {
        status: CommandStatus.ERROR,
        output: error instanceof Error ? error.message : 'Erreur inconnue'
      })
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  return {
    generateCommand,
    isProcessing
  }
} 
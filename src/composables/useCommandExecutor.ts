import { ref } from 'vue'
import { MacOSCommandExecutor } from '@/services/system/commandExecutor'
import type { Command } from '@/types/command'
import { CommandStatus } from '@/types/command'
import { useCommandStore } from '@/stores/commandStore'

export function useCommandExecutor() {
  const executor = new MacOSCommandExecutor()
  const isExecuting = ref(false)
  const commandStore = useCommandStore()

  const executeCommand = async (command: Command) => {
    isExecuting.value = true
    
    try {
      const validation = executor.validateCommand(command.generatedCommand)
      
      if (!validation.isValid) {
        commandStore.updateCommand(command.id, {
          status: CommandStatus.ERROR,
          output: validation.message
        })
        return
      }

      commandStore.updateCommand(command.id, {
        status: CommandStatus.EXECUTING
      })

      const result = await executor.execute(command.generatedCommand)

      commandStore.updateCommand(command.id, {
        status: result.success ? CommandStatus.COMPLETED : CommandStatus.ERROR,
        output: result.success ? result.output : result.error
      })

      return result
    } catch (error) {
      commandStore.updateCommand(command.id, {
        status: CommandStatus.ERROR,
        output: error instanceof Error ? error.message : 'Erreur inconnue'
      })
      throw error
    } finally {
      isExecuting.value = false
    }
  }

  return {
    executeCommand,
    isExecuting
  }
} 
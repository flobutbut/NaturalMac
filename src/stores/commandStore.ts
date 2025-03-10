import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Command } from '@/types/command'

export const useCommandStore = defineStore('command', () => {
  const commands = ref<Command[]>([])
  const currentCommand = ref<Command | null>(null)

  const addCommand = (command: Command) => {
    commands.value.push(command)
  }

  const updateCommand = (id: string, updates: Partial<Command>) => {
    const index = commands.value.findIndex(cmd => cmd.id === id)
    if (index !== -1) {
      commands.value[index] = { ...commands.value[index], ...updates }
    }
  }

  const setCurrentCommand = (command: Command | null) => {
    currentCommand.value = command
  }

  return {
    commands,
    currentCommand,
    addCommand,
    updateCommand,
    setCurrentCommand
  }
}) 
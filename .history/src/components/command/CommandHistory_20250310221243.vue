<template>
  <div class="command-history">
    <div class="command-history__header">
      <h2>{{ $t('command.history.title') }}</h2>
      <button 
        v-if="commands.length"
        class="btn btn--text" 
        @click="clearHistory"
      >
        {{ $t('command.history.clear') }}
      </button>
    </div>

    <div class="command-history__list" ref="historyList">
      <TransitionGroup name="command-list">
        <CommandItem
          v-for="command in commands"
          :key="command.id"
          :command="command"
          @execute="executeCommand"
          @cancel="cancelCommand"
        />
      </TransitionGroup>
    </div>

    <div 
      v-if="!commands.length" 
      class="command-history__empty"
    >
      {{ $t('command.history.empty') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { useCommandStore } from '@/stores/commandStore'
import { CommandStatus } from '@/types/command'
import type { Command } from '@/types/command'
import CommandItem from './CommandItem.vue'
import { useI18n } from 'vue-i18n'
import { useCommandExecutor } from '@/composables/useCommandExecutor'

const { t } = useI18n()
const commandStore = useCommandStore()
const historyList = ref<HTMLElement | null>(null)

const commands = computed(() => commandStore.commands)
const { executeCommand: execCommand, isExecuting } = useCommandExecutor()

const executeCommand = async (command: Command) => {
  try {
    await execCommand(command)
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la commande:', error)
  }
}

const cancelCommand = (command: Command) => {
  commandStore.updateCommand(command.id, {
    status: CommandStatus.COMPLETED,
    output: 'Commande annulée'
  })
}

const clearHistory = () => {
  if (confirm(t('command.history.confirmClear'))) {
    commandStore.$reset()
  }
}

// Scroll automatique vers la dernière commande
watch(() => commands.value.length, () => {
  nextTick(() => {
    if (historyList.value) {
      historyList.value.scrollTop = historyList.value.scrollHeight
    }
  })
})
</script>

<style scoped>
.command-history {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-front);
  overflow: hidden;
}

.command-history__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.2);
}

.command-history__header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.command-history__list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.command-history__empty {
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem;
}

.command-list-enter-active,
.command-list-leave-active {
  transition: all 0.3s ease;
}

.command-list-enter-from,
.command-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style> 
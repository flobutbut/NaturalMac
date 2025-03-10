<template>
  <div class="command-item" :class="command.status">
    <div class="command-item__header">
      <span class="command-item__timestamp">{{ formattedTime }}</span>
      <span class="command-item__status">{{ $t(`command.status.${command.status}`) }}</span>
    </div>
    
    <div class="command-item__content">
      <div class="command-item__input">
        <label>{{ $t('command.input.label') }}</label>
        <p>{{ command.input }}</p>
      </div>
      
      <div v-if="command.generatedCommand" class="command-item__generated">
        <label>{{ $t('command.generated.label') }}</label>
        <pre>{{ command.generatedCommand }}</pre>
        
        <div class="command-item__actions" v-if="command.status === 'confirming'">
          <button 
            class="btn btn--primary" 
            @click="$emit('execute', command)"
          >
            {{ $t('command.actions.execute') }}
          </button>
          <button 
            class="btn btn--secondary" 
            @click="$emit('cancel', command)"
          >
            {{ $t('command.actions.cancel') }}
          </button>
        </div>
      </div>
      
      <div v-if="command.output" class="command-item__output">
        <label>{{ $t('command.output.label') }}</label>
        <pre>{{ command.output }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Command } from '@/types/command'

const props = defineProps<{
  command: Command
}>()

const formattedTime = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(props.command.timestamp)
})

defineEmits<{
  (e: 'execute', command: Command): void
  (e: 'cancel', command: Command): void
}>()
</script>

<style scoped>
.command-item {
  margin-bottom: 1rem;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
}

.command-item__header {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
}

.command-item__content {
  padding: 1rem;
}

.command-item__content > div {
  margin-bottom: 1rem;
}

.command-item__content label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.command-item__generated pre,
.command-item__output pre {
  margin: 0;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow-x: auto;
  font-family: var(--font-family);
}

.command-item__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.command-item.error {
  border-color: var(--error-color);
}

.command-item.executing {
  border-color: var(--primary-color);
}

.command-item.completed {
  border-color: var(--success-color);
}
</style> 
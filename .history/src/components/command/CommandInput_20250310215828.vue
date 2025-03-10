<template>
  <div class="command-input">
    <form @submit.prevent="handleSubmit" class="command-input__form">
      <span class="command-input__prompt">></span>
      <input
        v-model="input"
        type="text"
        :placeholder="$t('command.input.placeholder')"
        class="command-input__field"
        :disabled="isProcessing"
      />
      <button 
        type="submit"
        :disabled="!input.length || isProcessing"
        class="btn btn--primary command-input__submit"
      >
        {{ isProcessing ? $t('command.input.processing') : $t('command.input.submit') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCommandStore } from '@/stores/commandStore'
import { CommandStatus, CommandType } from '@/types/command'
import { useAI } from '@/composables/useAI'
import { v4 as uuidv4 } from 'uuid'

const input = ref('')
const commandStore = useCommandStore()
const { generateCommand, isProcessing } = useAI()

const handleSubmit = async () => {
  const command = {
    id: uuidv4(),
    input: input.value,
    generatedCommand: '',
    status: CommandStatus.PENDING,
    timestamp: new Date(),
    type: CommandType.SYSTEM
  }
  
  commandStore.addCommand(command)
  commandStore.setCurrentCommand(command)
  
  try {
    await generateCommand(command)
  } catch (error) {
    console.error('Erreur lors de la génération de la commande:', error)
  }
  
  input.value = ''
}
</script>

<style scoped>
.command-input {
  padding: 1rem;
}

.command-input__form {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.command-input__prompt {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.2rem;
}

.command-input__field {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: var(--font-size-base);
}

.command-input__field:focus {
  outline: none;
}

.command-input__field::placeholder {
  color: var(--text-secondary);
}

.command-input__submit {
  min-width: 100px;
}
</style> 
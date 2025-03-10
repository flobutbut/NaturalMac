<template>
  <div class="command-input">
    <form @submit.prevent="handleSubmit" class="command-input__form">
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
        class="command-input__submit"
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
  width: 100%;
  padding: 1rem 1.5rem;
}

.command-input__form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.command-input__field {
  flex: 1;
  padding: 0.5rem;
  font-size: 1.1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.command-input__submit {
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  height: 100%;
  min-height: 38px; /* Pour correspondre à la hauteur de l'input */
}

.command-input__field:disabled,
.command-input__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 
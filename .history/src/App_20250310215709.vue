<template>
  <div class="app">
    <header class="app-header">
      <h1>{{ $t('app.title') }}</h1>
    </header>

    <main class="app-main">
      <CommandHistory />
    </main>

    <footer class="app-footer">
      <CommandInput />
    </footer>
  </div>
</template>

<script setup lang="ts">
import CommandInput from '@/components/command/CommandInput.vue'
import CommandHistory from '@/components/command/CommandHistory.vue'
</script>

<style>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-background);
}

.app-header {
  padding: 1rem;
  background-color: var(--surface-front);
  border-bottom: 1px solid var(--border-color);
}

.app-header h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--text-primary);
}

.app-main {
  flex: 1;
  overflow: hidden;
  padding: 1rem;
}

.app-footer {
  background-color: var(--surface-front);
  border-top: 1px solid var(--border-color);
}
</style> 
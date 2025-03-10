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
}

.app-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.app-main {
  flex: 1;
  overflow: hidden;
}

.app-footer {
  border-top: 1px solid var(--border-color);
}
</style> 
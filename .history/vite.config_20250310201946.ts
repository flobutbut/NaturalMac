import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.ELECTRON === 'true' ? './' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    exclude: ['electron']
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
}) 
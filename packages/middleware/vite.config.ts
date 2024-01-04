import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    target: 'esnext',
    lib: {
      entry: './index.ts',
      formats: ['cjs'],
      fileName: 'index'
    }
  }
})

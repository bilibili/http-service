import { defineConfig } from 'vite'

// https://vitejs.dev/config/
const modern = defineConfig({
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: false,
    lib: {
      entry: './index.ts',
      formats: ['cjs', 'es'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`
    }
  }
})

const legacy = defineConfig({
  build: {
    outDir: 'dist',
    target: 'es2015',
    emptyOutDir: false,
    minify: false,
    lib: {
      entry: './index.ts',
      formats: ['cjs', 'es'],
      fileName: (format) => `index.legacy.${format === 'es' ? 'esm.' : ''}js`
    }
  }
})

const config = process.env.BUILD_TYPE === 'legacy' ? legacy : modern
export default config

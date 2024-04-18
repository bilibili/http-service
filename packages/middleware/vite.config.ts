import { defineConfig, PluginOption } from 'vite'
import babel from '@rollup/plugin-babel'
const isLegacy = process.env.BUILD_TYPE === 'legacy'

// https://vitejs.dev/config/
const modern = defineConfig({
  build: {
    outDir: 'dist',
    target: 'es2018',
    minify: false,
    lib: {
      entry: './index.ts',
      formats: ['cjs', 'es'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`
    }
  }
})

const legacy = defineConfig({
  plugins: [
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.ts', '.jsx', '.tsx']
    }) as PluginOption
  ],
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

const config = isLegacy ? legacy : modern
export default config

import { defineConfig, PluginOption } from 'vite'
import createExternalPlugin from 'vite-plugin-external'
import dts from 'vite-plugin-dts'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const format = process.env.BUILD_FORMAT
const isEs = format === 'esm'

const isProd = process.env.NODE_ENV === 'production'

const plugins: PluginOption[] = format === 'cjs' ? [dts({})] : []

if (isProd) {
  plugins.push(
    createExternalPlugin({
      externals: Object.keys(pkg.peerDependencies).reduce((map, name) => {
        map[name] = name
        return map
      }, {})
    }) as PluginOption
  )
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    target: isEs ? 'esnext' : 'es2015',
    minify: !isEs,
    emptyOutDir: isEs,
    lib: {
      entry: 'index.ts',
      formats: isEs ? ['es'] : ['cjs'],
      fileName: 'index'
    },
    rollupOptions: {
      output: {
        entryFileNames: `index.${isEs ? 'esm.' : ''}js`
      }
    }
  },
  plugins
})

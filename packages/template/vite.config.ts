import { defineConfig, PluginOption } from 'vite'
import createExternalPlugin from 'vite-plugin-external'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const isProd = process.env.NODE_ENV === 'production'

const plugins: PluginOption[] = []

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
    target: 'esnext',
    lib: {
      entry: 'index.ts',
      formats: ['es'],
      fileName: 'index'
    }
  },
  plugins
})

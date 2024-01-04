import { defineConfig, PluginOption } from 'vite'
import createExternalPlugin from 'vite-plugin-external'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'index.ts',
      formats: ['es', 'cjs'],
      fileName: 'index'
    }
  },
  plugins: [
    createExternalPlugin({
      externals: Object.keys(pkg.peerDependencies).reduce((map, name) => {
        map[name] = name
        return map
      }, {})
    }) as PluginOption
  ]
})

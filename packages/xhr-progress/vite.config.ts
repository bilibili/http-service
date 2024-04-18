import { defineConfig, PluginOption } from 'vite'
import createExternalPlugin from 'vite-plugin-external'
import dts from 'vite-plugin-dts'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const isProd = process.env.NODE_ENV === 'production'

const plugins: PluginOption[] = [dts({ outputDir: './types', entryRoot: './' })]

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
  },
  plugins
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
  },
  plugins
})

const config = process.env.BUILD_TYPE === 'legacy' ? legacy : modern
export default config

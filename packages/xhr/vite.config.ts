import { defineConfig, PluginOption } from 'vite'
import createExternalPlugin from 'vite-plugin-external'
import dts from 'vite-plugin-dts'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const isProd = process.env.NODE_ENV === 'production'
const isLegacy = process.env.BUILD_TYPE === 'legacy'
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
  if (isLegacy) {
    plugins.push(dts({ outputDir: './types', entryRoot: './' }))
  }
}

const modern = defineConfig({
  build: {
    outDir: 'dist',
    target: 'es2018',
    sourcemap: true,
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
    sourcemap: true,
    lib: {
      entry: './index.ts',
      formats: ['cjs', 'es'],
      fileName: (format) => `index.legacy.${format === 'es' ? 'esm.' : ''}js`
    }
  },
  plugins
})

const config = isLegacy ? legacy : modern
export default config

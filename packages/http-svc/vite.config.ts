import { defineConfig, PluginOption } from 'vite'
import { createRequire } from 'module'
import createExternalPlugin from 'vite-plugin-external'
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
  build:
    process.env.BUILD_TYPE === 'legacy'
      ? {
          outDir: 'dist',
          target: 'es2015',
          emptyOutDir: false,
          minify: false,
          lib: {
            entry: 'src/index.ts',
            formats: ['cjs', 'es'],
            fileName: (format) => `index.legacy.${format === 'es' ? 'esm.' : ''}js`
          }
        }
      : {
          outDir: 'dist',
          minify: false,
          target: 'esnext',
          lib: {
            entry: 'src/index.ts',
            formats: ['cjs', 'es'],
            fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`
          }
        },
  plugins,
  server: {
    port: 8080,
    host: '0.0.0.0'
  }
})

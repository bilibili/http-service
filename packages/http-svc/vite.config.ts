import { defineConfig, PluginOption } from 'vite'
import { createRequire } from 'module'
import createExternalPlugin from 'vite-plugin-external'
import babel from '@rollup/plugin-babel'
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
    plugins.push(
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions: ['.js', '.ts', '.jsx', '.tsx']
      })
    )
  }
}
// https://vitejs.dev/config/
export default defineConfig({
  build: isLegacy
    ? {
        outDir: 'dist',
        target: 'es2015',
        sourcemap: true,
        emptyOutDir: false,
        minify: true,
        lib: {
          entry: 'src/index.ts',
          formats: ['cjs', 'es'],
          fileName: (format) => `index.legacy.${format === 'es' ? 'esm.' : ''}js`
        }
      }
    : {
        outDir: 'dist',
        minify: false,
        sourcemap: true,
        target: 'es2018',
        lib: {
          entry: 'src/index.ts',
          formats: ['cjs', 'es'],
          fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`
        }
      },
  plugins,
  server: {
    port: 80,
    host: '0.0.0.0'
  }
})

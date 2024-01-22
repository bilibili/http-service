import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import filesize from 'rollup-plugin-filesize'
import { fileURLToPath } from 'url'
import babel from '@rollup/plugin-babel'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const calcPath = (realPath) => {
  return path.resolve(__dirname, realPath)
}

const getConfig = (format, ugly = false) => {
  let fileName
  switch (format) {
    case 'es':
      fileName = `unios.esm.js`
      break
    case 'cjs':
      fileName = `unios.js`
      break
    case 'umd':
      fileName = `unios.${ugly ? 'umd.min' : 'umd'}.js`
      break
  }
  const isUMD = format === 'umd'
  const isESM = format === 'es'
  return {
    input: calcPath('index.ts'),
    output: {
      file: calcPath(`dist/${fileName}`),
      format,
      name: 'Unios',
      exports: 'default'
    },
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'ESNext'
          }
        },
        useTsconfigDeclarationDir: true
      }),
      resolve({ browser: true }),
      !isESM &&
        commonjs({
          include: isUMD ? ['node_modules/**', 'index.ts'] : ['index.ts']
        }),
      !isESM &&
        babel({
          include: ['node_modules/**', 'index.ts'],
          extensions: ['.js', '.ts'],
          presets: ['@babel/preset-env']
        }),
      ugly && terser(),
      filesize()
    ],
    external: !isUMD && ['@http-svc/middleware', 'http-svc']
  }
}

const configs = []
;['es', 'cjs', 'umd'].forEach((format) => {
  configs.push(getConfig(format, false))
  if (format === 'umd') {
    configs.push(getConfig(format, true))
  }
})

export default configs

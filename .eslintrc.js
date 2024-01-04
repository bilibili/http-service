module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    // TS
    'plugin:@typescript-eslint/recommended',
    // 接入 prettier 的规则
    'prettier',
    'plugin:prettier/recommended'
  ],
  rules: {
    'max-len': [ 2, 140 ]
  },
}

module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  settings: { react: { version: 'detect' } },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser'
    }
  ],
  rules: {
    'react/react-in-jsx-scope': 'off'
  }
}
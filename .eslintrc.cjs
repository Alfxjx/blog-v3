module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
    'eslint-config-prettier',
  ],
  plugins: ['react-refresh', 'eslint-plugin-prettier'],
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  rules: {
    'react-refresh/only-export-components': 'warn',
  },
};

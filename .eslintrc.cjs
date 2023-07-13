module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    'plugin:react-hooks/recommended', 'plugin:storybook/recommended',
    "prettier"
  ],
  "plugins": ['react-refresh'],
  "env": {
    "browser": true,
    "node": true,
    "es2020": true
  },
  "rules": {
    "prettier/prettier": "error",
    'react-refresh/only-export-components': 'warn'
  }
}
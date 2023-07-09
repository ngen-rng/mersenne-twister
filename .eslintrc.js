module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: ['standard-with-typescript', 'eslint:recommended', 'prettier'],
  overrides: [],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/consistent-type-definitions': 'off',
  },
};

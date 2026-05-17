import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  {
    ignores: ['dist', 'node_modules', '.idea'],
  },
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: 'module',
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  prettier,
];

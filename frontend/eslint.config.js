import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
// import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: process.cwd(),
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            import: importPlugin,
            // prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'error',
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'import/order': ['error', { 'newlines-between': 'always' }],
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
    {
        ignores: ['node_modules', 'dist', 'build'],
    },
];

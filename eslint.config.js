import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      // Punto y coma obligatorio
      'semi': ['error', 'always'],

      // Comillas simples
      'quotes': ['error', 'single', { avoidEscape: true }],

      // Máximo 170 caracteres por línea, ignorar template literals
      'max-len': ['warn', { code: 170, ignoreTemplateLiterals: true }],

      // Máximo 2 líneas en blanco consecutivas, 0 al final del archivo
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],

      // No permitir console.log
      'no-console': 'error',

      // Ignorar variables no usadas que empiecen con _
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],

      // Preferir const sobre let, y let sobre var
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    ignores: ['node_modules/'],
  },
];

import antfu from '@antfu/eslint-config';

export default antfu({
  ignores: ['*.md', '*.json', '.github/**/*', 'wrangler.toml', 'worker-configuration.d.ts'],
  include: ['app/**/*.ts', 'app/**/*.tsx', 'app/**/*.js', 'app/**/*.jsx', 'prisma/*.ts'],
  formatters: true,
  stylistic: {
    quotes: 'single',
    semi: true,
    overrides: {
      'comma-dangle': ['error', 'always-multiline'],
      'jsonc/comma-dangle': ['error', 'always-multiline'],
      'style/jsx-sort-props': 'warn',
      'arrow-body-style': ['error', 'as-needed'],
      'no-restricted-imports': ['error', { patterns: ['../*'] }],
      'unused-imports/no-unused-imports': 'warn',
      'ts/consistent-type-definitions': ['error', 'interface'],
      'ts/explicit-function-return-type': 'off',
      'style/arrow-parens': ['error', 'always'],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'antfu/consistent-list-newline': ['error', { ArrayExpression: false }],
      'antfu/if-newline': 'off',
    },
  },
  typescript: {
    parserOptions: {
      project: './tsconfig.json',
      projectService: true,
    },
    overrides: {
      'ts/consistent-type-definitions': ['error', 'type'],
      'ts/explicit-function-return-type': ['error'],
      'ts/explicit-member-accessibility': ['error'],
      'ts/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allowSingleOrDouble',
        },
      ],
      'ts/no-floating-promises': ['error'],
      'ts/no-misused-promises': ['error'],
      'ts/no-confusing-void-expression': ['error'],
      'ts/strict-boolean-expressions': ['error'],
      'ts/switch-exhaustiveness-check': ['error'],
      'ts/array-type': ['error', { default: 'array-simple' }],
      'ts/no-restricted-types': 'off',
      'ts/no-unsafe-argument': 'error',
      'node/prefer-global/process': 'off',
      'ts/no-empty-object-type': 'off',
      'func-style': ['error', 'declaration'],
      'no-case-declarations': 'off',
      'regexp/no-obscure-range': ['error', { allowed: 'all' }],
      'ts/no-redeclare': 'off',
    },
  },
  rules: {
    'antfu/no-top-level-await': 'off',
  },
  react: {
    overrides: {
      'react-refresh/only-export-components': 'off',
    },
  },
});

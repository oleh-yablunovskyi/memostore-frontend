module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
  ],
  overrides: [
    {
      files: ['.eslintrc.js'],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        ecmaVersion: 'latest',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
  ],
  rules: {
    quotes: ['error', 'single'],
    'no-trailing-spaces': ['error'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    'eol-last': ['error', 'always'],
    'import/prefer-default-export': 'off',
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    'object-curly-newline': 'off',
    'max-len': 'off',
    'react/function-component-definition': 'off',
    'arrow-body-style': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/no-array-index-key': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/require-default-props': 'off',
    'react/no-unused-prop-types': 'warn',
  },
};

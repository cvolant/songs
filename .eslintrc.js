module.exports = {
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'import/no-extraneous-dependencies': [2, { devDependencies: ['**/test.tsx', '**/test.ts'] }],
    '@typescript-eslint/indent': [2, 2],
    'import/no-unresolved': 0,
    'import/no-named-as-default': 0,
    'no-underscore-dangle': 0,
    '@typescript-eslint/interface-name-prefix': [2, { prefixWithI: "always" }],
    'react/prop-types': 0,
    'no-console': 0,  // Remove when ready to go to prod
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
  },
};
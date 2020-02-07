module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/attribute-hyphenation': 1,
    'vue/attributes-order': 1,
    'vue/no-confusing-v-for-v-if': 1,
    'vue/order-in-components': 1
    //'vue/order-in-components': 'warning'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "vue/multi-word-component-names": "off",
    "no-mixed-spaces-and-tabs":0,
    'no-undef': 0,
    'no-unused-vars':0,
    'vue/no-unused-components':0,
    'no-extra-semi':0,
    'no-useless-escape':0,
  },
  globals: {
    'Vue': true,
  }
}

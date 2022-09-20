// https://miyauchi.dev/posts/vite-vue3-typescript/
// eslint配置: https://github.com/shengxinjing/ailemente 先看这个

/* eslint-disable */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    // 'standard-with-typescript',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
    'semi': 1
  }
}

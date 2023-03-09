module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-extra-semi": "off",
    "no-unused-vars": "off",
    "promise/param-names": "off",
    "duplicate-attribute": "off",
    "vue/require-v-for-keys":"off",
    "vue/valid-v-for":"off",
    "no-control-regex": 0
    
 
  }
}

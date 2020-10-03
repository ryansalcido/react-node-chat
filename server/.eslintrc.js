module.exports = {
  "env": {
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 11
  },
  "rules": {
    "indent": [ "error", 2, { "SwitchCase": 1 } ],
    "quotes": [ "error", "double" ],
    "semi": [ "error", "always" ],
    "eol-last": [ "error", "always" ],
    "array-element-newline": [ "error", "consistent" ],
    "object-curly-spacing": [ "error", "always" ],
    "array-bracket-spacing": [ "error", "always" ]
  }
};

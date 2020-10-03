module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jest": true,
  },
  "extends": "react-app",
  "rules": {
    //Use this rule instead of original "indent" eslint rule to avoid weird eslint errors when using VS Code
    "@typescript-eslint/indent": [ "error", 2, { "SwitchCase": 1 } ],
    "quotes": [ "error", "double" ],
    "semi": [ "error", "always" ],
    "eol-last": [ "error", "always" ],
    "array-element-newline": [ "error", "consistent" ],
    "object-curly-spacing": [ "error", "always" ],
    "array-bracket-spacing": [ "error", "always" ]
  },
};
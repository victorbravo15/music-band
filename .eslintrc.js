module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "standard"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "semi": ["error", "always"],
        "space-before-function-paren": "off",
        "indent": "off"
    }
};

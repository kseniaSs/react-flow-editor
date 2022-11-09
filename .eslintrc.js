/* eslint-disable no-undef */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:security/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["react", "@typescript-eslint"],
  settings: {
    react: {
      version: "17.0.2"
    },
    "import/resolver": {
      typescript: true,
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    "react/prop-types": "off",
    "react/display-name": "off",
    "import/no-unresolved": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_.*$",
        varsIgnorePattern: "^_.*$",
        ignoreRestSiblings: true
      }
    ],
    "no-console": ["error", { allow: ["error"] }],
    "import/no-cycle": [
      "error",
      {
        maxDepth: 10,
        ignoreExternal: true
      }
    ]
  }
}

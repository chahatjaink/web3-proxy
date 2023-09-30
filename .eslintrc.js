module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    // Add your project-specific rules here

    // Example rules:
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-unused-vars": "error",

    // Managing cyclomatic complexity
    complexity: ["error", 5], // Set your desired complexity threshold (e.g., 10)
  },
};

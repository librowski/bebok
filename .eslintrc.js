module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
      "@typescript-eslint/no-explicit-any": 0,
      "no-unused-vars": 0,
  }
};

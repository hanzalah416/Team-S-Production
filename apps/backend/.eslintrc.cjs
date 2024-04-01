module.exports = {
  env: { node: true, es2020: true },
  extends: ["custom"],
  root: true,
  parserOptions: { ecmaVersion: "ESNext", sourceType: "script" },
  rules: {
    "@typescript-eslint/no-explicit-any": ["off"],
  },
};

import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json", // ✅ enables type-aware linting
      },
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
      "@typescript-eslint": tsPlugin,
    },
    extends: [
      js.configs.recommended,
      ...pluginReact.configs.flat.recommended,
      "plugin:@typescript-eslint/recommended-type-checked",
    ],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
]);

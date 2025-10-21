import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      // Treat fatal runtime problems as errors
      "no-undef": "error",
      "no-redeclare": "error",
      "no-unused-expressions": "error",

      // Treat optimization / style as warnings
      "no-unused-vars": "warn",
      "no-console": "warn",
      "complexity": ["warn", { "max": 10 }]
    },
  },
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,

      "react/react-in-jsx-scope": "off",   // JSX React import not required
      "react/prop-types": "off",           // Optional
      "react/jsx-no-target-blank": "off", // Optional
    },
  },
]);

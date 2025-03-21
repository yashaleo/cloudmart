import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import * as emotion from "@emotion/eslint-plugin";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@emotion": emotion,
    },
    rules: {
      ...js.configs.recommended?.rules, // Ensure it's defined
      ...react.configs?.recommended?.rules, // Check if react.configs is defined
      ...react.configs?.["jsx-runtime"]?.rules, // Check if jsx-runtime exists
      ...reactHooks.configs?.recommended?.rules, // Ensure react-hooks config is defined
      ...(emotion.configs?.recommended?.rules || {}), // Avoid undefined issues with Emotion
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
      "react/jsx-props-no-spreading": "off",
    },
  },
];

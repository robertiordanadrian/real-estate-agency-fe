import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: ["node_modules", "dist"],

    languageOptions: {
      globals: {
        ...globals.browser,
        google: "readonly",
      },
      parser: tseslint.parser,
      ecmaVersion: 2020,
      parserOptions: {
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      prettier,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,

      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "off",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",

      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      "unused-imports/no-unused-imports": "error",

      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z0-9_]+$",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      "import/no-unresolved": "off",

      "prettier/prettier": "error",

      "react-refresh/only-export-components": "warn",
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },

  {
    files: ["vite.config.ts"],
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
    },
    rules: {
      "no-undef": "off",
    },
  },

  prettierConfig,
]);

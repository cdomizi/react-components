import pluginJs from "@eslint/js";
import pluginJestDom from "eslint-plugin-jest-dom";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "node_modules",
      "dist",
      "dist-ssr",
      "*.local",
      // Logs
      "logs",
      "*.log",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "pnpm-debug.log*",
      "lerna-debug.log*",
      // Yarn
      ".pnp.*",
      ".yarn/*",
      "!.yarn/patches",
      "!.yarn/plugins",
      "!.yarn/releases",
      "!.yarn/sdks",
      "!.yarn/versions",
    ],
  },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  react.configs.flat.recommended,
  // MISSING: react-hooks
  {
    languageOptions: {
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true,
        },
        project: ["./tsconfig.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      ["@typescript-eslint"]: tseslint.plugin,
      react,
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": 0,
      "@typescript-eslint/no-unused-vars": 1,
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/prefer-nullish-coalescing": 0,
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
      "@typescript-eslint/no-namespace": [2, { allowDeclarations: true }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Test files
  {
    files: ["/test/**", "**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    plugins: {
      vitest,
      // MISSING: jest-dom
    },
    rules: {
      ...vitest.configs.recommended.rules,
      ...pluginJestDom.configs["flat/recommended"],
    },
  },
  // Disable type-aware linting for JS files
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    ...tseslint.configs.disableTypeChecked,
  },
  // Prettier config
  eslintPluginPrettierRecommended,
];

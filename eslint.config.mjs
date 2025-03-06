import globals from "globals";
import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
    {
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    pluginJs.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        rules: {
            "no-unused-vars": "warn",
            indent: ["error", 4],
            "prettier/prettier": ["error", { tabWidth: 4, useTabs: false }],
        },
    },
    {
        ignores: ["dist/*"],
    },
    {
        files: ["**/*.test.js"],
        ...jest.configs["flat/recommended"],
        rules: {
            ...jest.configs["flat/recommended"].rules,
            "jest/prefer-expect-assertions": "off",
        },
    },
];

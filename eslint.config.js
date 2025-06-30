import prettier from "eslint-plugin-prettier/recommended";
import js from "@eslint/js";
import ts from "typescript-eslint";

export default ts.config(
    js.configs.recommended,
    ...ts.configs.recommended,
    prettier,
    {
        ignores: ["node_modules", "dist"],
    },
);

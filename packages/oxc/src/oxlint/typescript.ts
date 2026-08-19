import { defineConfig } from "oxlint";

/**
 * TypeScript-specific Oxlint rules.
 *
 * @since @next
 */
export const oxlintTypeScriptConfig = defineConfig({
	rules: {
		"typescript/no-explicit-any": "warn",
		"typescript/consistent-type-imports": ["error", { fixStyle: "separate-type-imports" }],
		"typescript/consistent-type-definitions": ["warn", "type"],
		"typescript/no-non-null-assertion": "warn",
		"typescript/adjacent-overload-signatures": "error",
		"typescript/prefer-literal-enum-member": "error",
	},
});

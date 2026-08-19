import { defineConfig } from "oxlint";

/**
 * Test-file Oxlint exceptions.
 *
 * @since @next
 */
export const oxlintTestConfig = defineConfig({
	overrides: [
		{
			files: ["**/test/**", "**/*.test.ts", "**/*.spec.ts"],
			rules: {
				"typescript/no-explicit-any": "off",
				"no-console": "off",
			},
		},
	],
});

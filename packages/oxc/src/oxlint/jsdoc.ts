import { defineConfig } from "oxlint";

/**
 * Validates JSDoc tags and documented property names without requiring documentation everywhere.
 *
 * @since @next
 */
export const oxlintJsdocConfig = defineConfig({
	plugins: ["jsdoc"],
	rules: {
		"jsdoc/check-property-names": "error",
		"jsdoc/check-tag-names": "error",
		"jsdoc/require-throws-description": "error",
		"jsdoc/require-throws-type": "error",
	},
});

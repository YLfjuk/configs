import { defineConfig } from "oxlint";

/**
 * Framework-neutral Oxlint rules and repository ignores.
 *
 * @since @next
 */
export const oxlintBaseConfig = defineConfig({
	plugins: ["eslint", "typescript", "unicorn", "import", "promise", "react", "jsx-a11y", "oxc"],
	categories: {
		correctness: "error",
		suspicious: "warn",
		perf: "warn",
	},
	rules: {
		"no-console": "error",
		eqeqeq: ["error", "always"],
		"unicorn/prefer-node-protocol": "warn",
		"import/no-cycle": "error",
		"import/no-default-export": "error",
		"promise/valid-params": "off",
	},
	overrides: [
		{
			files: ["**/*.config.ts", "**/*.config.mts", "**/*.config.mjs"],
			rules: { "import/no-default-export": "off" },
		},
		{
			files: ["**/scripts/**"],
			rules: { "no-console": "off" },
		},
	],
});

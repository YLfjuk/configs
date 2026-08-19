import { defineConfig } from "oxlint";

/**
 * React and JSX-specific Oxlint rules.
 *
 * @since @next
 */
export const oxlintReactConfig = defineConfig({
	rules: {
		"react/react-in-jsx-scope": "off",
		"react/jsx-curly-brace-presence": ["error", { props: "always" }],
		"react/no-array-index-key": "warn",
	},
});

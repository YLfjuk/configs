import { defineConfig } from "oxfmt";

/** Project-specific Oxfmt additions. Tailwind sorting stays disabled unless configured. @since @next */
export type OxfmtOptions = {
	scopes?: readonly string[];
	internalPatterns?: readonly string[];
	tailwind?: {
		stylesheet: string;
		functions?: readonly string[];
	};
	ignorePatterns?: readonly string[];
};

/** Creates the shared Oxfmt configuration with optional project-specific sorting. @since @next */
export function createOxfmtConfig(options: OxfmtOptions = {}): ReturnType<typeof defineConfig> {
	return defineConfig({
		tabWidth: 4,
		useTabs: true,
		printWidth: 100,
		semi: true,
		singleQuote: false,
		jsxSingleQuote: false,
		quoteProps: "as-needed",
		bracketSpacing: true,
		trailingComma: "all",
		arrowParens: "always",
		endOfLine: "lf",
		ignorePatterns: options.ignorePatterns ? [...options.ignorePatterns] : undefined,
		sortImports: {
			ignoreCase: true,
			order: "asc",
			internalPattern: [...(options.internalPatterns ?? [])],
			customGroups: [
				{
					groupName: "react",
					elementNamePattern: ["react", "react-**"],
				},
				...(options.scopes?.length
					? [
							{
								groupName: "scope",
								elementNamePattern: options.scopes.map((scope) => `@${scope}/**`),
							},
						]
					: []),
			],
			groups: [
				"side_effect",
				"builtin",
				"external",
				"react",
				{
					newlinesBetween: false,
				},
				...(options.scopes?.length ? ["scope"] : []),
				["internal", "subpath"],
				{
					newlinesBetween: false,
				},
				["parent", "sibling", "index"],
				["style", "side_effect_style"],
				"unknown",
			],
		},
		sortTailwindcss: options.tailwind
			? {
					stylesheet: options.tailwind.stylesheet,
					functions: Array.from(
						new Set(["clsx", "cn", "cva", "tw", ...(options.tailwind.functions ?? [])]),
					),
				}
			: undefined,
		sortPackageJson: { sortScripts: false },
	});
}

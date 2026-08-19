import { defineConfig } from "oxlint";

import { oxlintBaseConfig } from "./oxlint/base.js";
import { oxlintJsdocConfig } from "./oxlint/jsdoc.js";
import { oxlintReactConfig } from "./oxlint/react.js";
import { oxlintTestConfig } from "./oxlint/test.js";
import { oxlintTypeScriptConfig } from "./oxlint/typescript.js";

/** Optional framework and test-runner rules for the combined Oxlint config. @since @next */
export type OXlintOptions = {
	jsdoc?: boolean;
	react?: boolean;
	vitest?: boolean;
};

/** Combines the base, TypeScript, and test rules with optional React and Vitest rules. @since @next */
export function createOxlintConfig(options: OXlintOptions = {}): ReturnType<typeof defineConfig> {
	const plugins = [
		...oxlintBaseConfig.plugins,
		...(options.jsdoc ? (["jsdoc"] as const) : []),
		...(options.vitest ? (["vitest"] as const) : []),
		...(options.react ? (["react"] as const) : []),
	];
	const jsdocConfig = options.jsdoc ? oxlintJsdocConfig : undefined;
	const reactConfig = options.react ? oxlintReactConfig : undefined;

	return defineConfig({
		...oxlintBaseConfig,
		plugins,
		rules: {
			...oxlintBaseConfig.rules,
			...oxlintTypeScriptConfig.rules,
			...jsdocConfig?.rules,
			...reactConfig?.rules,
		},
		overrides: [...oxlintBaseConfig.overrides, ...oxlintTestConfig.overrides],
	});
}

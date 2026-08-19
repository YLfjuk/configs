import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/*.ts", "src/oxlint/*.ts"],
	root: "src",
	format: "esm",
	dts: { sourcemap: true },
	sourcemap: true,
	exports: {
		customExports: {
			"./oxfmt.json": "./oxfmt.json",
			"./oxlint.json": "./oxlint.json",
		},
	},
	publint: true,
	attw: {
		profile: "esm-only",
	},
});

import assert from "node:assert/strict";
import test from "node:test";

import { createOxfmtConfig } from "../src/oxfmt.js";

test("adds only the project-specific formatter options requested", () => {
	const config = createOxfmtConfig({
		scopes: ["ylfjuk"],
		internalPatterns: ["@/"],
		tailwind: { stylesheet: "src/styles.css", functions: ["cn"] },
		ignorePatterns: ["generated/**"],
	});

	assert.deepEqual(config.sortImports?.internalPattern, ["@/"]);
	assert.deepEqual(config.sortImports?.customGroups?.at(1), {
		groupName: "scope",
		elementNamePattern: ["@ylfjuk/**"],
	});
	assert.deepEqual(config.sortTailwindcss, {
		stylesheet: "src/styles.css",
		functions: ["clsx", "cn", "cva", "tw"],
	});
	assert.deepEqual(config.ignorePatterns, ["generated/**"]);
});

test("does not enable Tailwind sorting by default", () => {
	assert.equal(createOxfmtConfig().sortTailwindcss, undefined);
});

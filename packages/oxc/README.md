# @ylfjuk/oxc

Shared Oxfmt and Oxlint configuration for `@YLfjuk` projects. It supports Node `^20.19.0 || >=22.12.0`.

Install it with its peer tools:

```sh
pnpm add -D @ylfjuk/oxc oxfmt oxlint
```

## Oxfmt

Use the factory when a project has scoped packages, internal aliases, or Tailwind:

```ts
import { createOxfmtConfig } from "@ylfjuk/oxc/oxfmt";

export default createOxfmtConfig({
	scopes: ["ylfjuk"],
	internalPatterns: ["@/"],
	tailwind: { stylesheet: "src/styles.css" },
});
```

For a portable baseline without project-specific sorting, pass `@ylfjuk/oxc/oxfmt.json` to Oxfmt with `-c`.

## Oxlint

The combined factory includes the base, TypeScript, and test rules. Enable React and Vitest rules only when the project uses them:

```ts
import { createOxlintConfig } from "@ylfjuk/oxc/oxlint";

export default createOxlintConfig({ jsdoc: true, react: true, vitest: true });
```

The composable exports are `@ylfjuk/oxc/oxlint/base`, `@ylfjuk/oxc/oxlint/typescript`, `@ylfjuk/oxc/oxlint/jsdoc`, `@ylfjuk/oxc/oxlint/react`, and `@ylfjuk/oxc/oxlint/test`. Use `@ylfjuk/oxc/oxlint.json` when a static baseline is more suitable.

## License

MIT [@YLfjuk](https://github.com/YLfjuk)

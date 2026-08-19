# Modernization migration plan

> Temporary implementation handoff. This file is safe to delete after the migration is complete.
>
> Status: implementation in progress. Do not publish, create a release, change secrets, or modify
> npm settings without separate explicit approval.

## Current status

Completed:

- pnpm 11.20.0 workspace migration, lockfile, root engine requirements, and local-binary scripts;
- TypeScript 7.0.2 migration and package-local tsconfig fixture checks;
- root migration from Biome to Oxlint and Oxfmt, while retaining the legacy Biome package;
- `@ylfjuk/oxc` static configurations, dynamic factories, source bridges, tsdown build, and focused
  Oxfmt behavior tests;
- repository-wide Oxfmt formatting/import-order pass and package manifest/file-allowlist hygiene;
- documentation updates, including the new Oxc README;
- direct `pnpm` audit checks with no reported vulnerabilities.

Remaining:

- validate packed tarballs in isolated consumer fixtures, including every documented Oxc ESM and JSON
  export;
- finalize release metadata and release changesets, including the intended initial Oxc version;
- modernize CI and the release workflow (Node 24, pnpm, pinned actions, least permissions, and no
  `NPM_TOKEN`);
- run the final clean-room validation; and
- after workflow review, configure npm trusted publishing manually. The first Oxc publication remains
  subject to separate explicit approval.

## Objective

Modernize this configuration-package monorepo while preserving existing public APIs, runtime behavior,
package entry points, module formats, and published artifacts unless an explicitly approved change is
required.

The migration will:

- move from npm to pnpm;
- move repository linting and formatting from Biome to Oxlint and Oxfmt;
- add a shared `@ylfjuk/oxc` package;
- upgrade to stable TypeScript 7;
- use tsdown for executable TypeScript package code, including generated package exports;
- modernize Changesets, CI, package validation, and npm publishing;
- configure npm trusted publishing through GitHub Actions OIDC;
- improve tests only where they protect meaningful behavior;
- remediate known dependency advisories.

## Non-negotiable constraints

- Do not reorganize the repository beyond the approved addition of `packages/oxc`.
- Do not move, rename, split, or merge existing packages or major configuration areas.
- Keep `packages/biome` as a legacy published package during this migration.
- Do not weaken TypeScript, lint, test, or security settings to make an upgrade pass.
- Do not add CommonJS output unless separately approved.
- Do not add unrelated refactors or speculative dependencies.
- Do not publish packages, create releases, deprecate npm packages, change secrets, or change external
  npm settings without explicit approval.
- Prefer stable releases; do not adopt release candidates, betas, alphas, or nightly builds.

## Inspection baseline

The repository currently contains four configuration-only packages:

| Package             | Version | Public content                                                    |
| ------------------- | ------: | ----------------------------------------------------------------- |
| `@ylfjuk/biome`     |   0.1.2 | Biome JSON config, documentation, license, VS Code recommendation |
| `@ylfjuk/md`        |   0.0.3 | Markdownlint JSON config                                          |
| `@ylfjuk/prettier`  |   0.0.1 | Prettier ESM config                                               |
| `@ylfjuk/tsconfigs` |   0.0.6 | Four JSON TypeScript configurations                               |

Observed repository state:

- npm workspaces are declared in the root `package.json`.
- The workspace includes `apps/*`, but no `apps` directory exists.
- `packageManager` is `npm@11.4.2`.
- GitHub Actions is the only CI/release provider.
- CI uses Node 20, which is end-of-life.
- CI uses `npm i`, old action majors, and a long-lived `NPM_TOKEN`.
- The release build is invoked once by the workflow and again by the `release` script.
- Changesets is configured, but `@changesets/changelog-github` is installed and unused.
- There is no tsup dependency, tsup configuration, source build, or historical tsup use.
- There is no Vitest dependency, Vitest configuration, test file, or historical Vitest use.
- The only effective test invokes TypeScript for `@ylfjuk/tsconfigs`.
- Root `test:types` is ineffective because no corresponding Turbo task/package scripts exist.
- Existing packages do not declare `files`, `engines`, or `publishConfig`.
- `@ylfjuk/biome` currently publishes its package-local `.vscode/extensions.json`.
- Documentation contains stale `template-monorepo` links and an incorrect Prettier badge.
- The repository was clean at inspection time.

The initial package dry run established these published file counts:

| Package             | Entries |
| ------------------- | ------: |
| `@ylfjuk/biome`     |       6 |
| `@ylfjuk/md`        |       5 |
| `@ylfjuk/prettier`  |       5 |
| `@ylfjuk/tsconfigs` |       8 |

Preserve these public surfaces unless a planned package allowlist intentionally removes an accidental
file and that change is approved.

## Security baseline

The existing npm lockfile audit reported seven vulnerable dependency nodes: four high, one moderate,
and two low.

Notable paths:

- `turbo@2.5.4` is affected by advisories fixed in later 2.x releases.
- `@changesets/cli@2.29.5` pulls vulnerable `external-editor` and `tmp` versions.
- Vulnerable transitive packages include `js-yaml`, `lodash`, and `picomatch`.

The final dependency graph must have no known high or critical advisories. Any remaining lower-severity
advisory must be documented with its dependency path, reachability, and remediation status.

## Approved decisions

The following decisions have been approved:

1. Add `packages/oxc` as a hybrid package with static JSON subpaths and typed dynamic factory exports.
2. Keep `packages/biome` intact as a legacy package, but stop using Biome internally.
3. Use tsdown only for the dynamic `@ylfjuk/oxc` package.
4. Do not add Vitest. Use Node 24's built-in `node:test` where behavioral tests add value.
5. Target Node 24 LTS and pnpm 11.20.0.
6. Upgrade directly to stable TypeScript 7.0.2; fall back to stable TypeScript 6 only for a demonstrated
   incompatibility.
7. Retain and update `@ylfjuk/prettier` as a legacy public package while Oxfmt becomes the repository
   formatter.
8. Remove nonexistent `apps/*` from workspace configuration.
9. Use npm trusted publishing through GitHub Actions OIDC, not a long-lived granular access token.
10. The user controls the `@ylfjuk` npm organization.
11. `@ylfjuk/oxc` does not exist on npm and must start at version `0.0.1`.
12. Let tsdown generate package export metadata for compiled entry points; do not duplicate those fields
    manually.

One publishing-policy choice remains open: direct OIDC publishing with no GitHub environment is the
current recommendation. A protected `npm` environment may be selected if a human approval gate is
preferred. See [Trusted publishing](#trusted-publishing).

## Verified target versions

Versions were checked on 19 August 2026. Recheck immediately before changing the lockfile because these
tools release frequently.

| Component                   | Current |    Planned stable target |
| --------------------------- | ------: | -----------------------: |
| Node.js                     | CI 20.x | 24 LTS, at least 24.18.0 |
| pnpm                        |    none |                  11.20.0 |
| TypeScript                  |   5.8.3 |                    7.0.2 |
| Turbo                       |   2.5.4 |                   2.10.7 |
| Changesets CLI              |  2.29.5 |                   2.31.1 |
| Oxlint                      |    none |                   1.77.0 |
| Oxfmt                       |    none |                   0.61.0 |
| tsdown                      |    none |                  0.22.14 |
| Prettier                    |   3.5.3 |                    3.9.6 |
| Trivago sort-imports plugin |   5.2.2 |                    6.0.2 |

Do not install Vitest merely to satisfy an inapplicable upgrade goal: the repository never used it.

Primary references:

- [TypeScript 7 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [Node.js release status](https://nodejs.org/en/about/previous-releases)
- [Oxlint shared configuration](https://oxc.rs/docs/guide/usage/linter/config)
- [Oxfmt configuration](https://oxc.rs/docs/guide/usage/formatter/config)
- [tsdown package exports](https://tsdown.dev/options/package-exports)
- [tsdown package validation](https://tsdown.dev/options/lint)
- [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)
- [npm v12 and GAT deprecation](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/)
- [GitHub Actions hardening](https://docs.github.com/en/code-security/tutorials/secure-your-organization/protect-against-threats)

## Proposed `@ylfjuk/oxc` contract

The package will expose both portable static configs and typed dynamic factories.

Planned public subpaths:

- `@ylfjuk/oxc`: primary typed API;
- `@ylfjuk/oxc/oxlint`: typed Oxlint configuration/factory;
- `@ylfjuk/oxc/oxfmt`: typed Oxfmt configuration/factory;
- `@ylfjuk/oxc/oxlint.json`: static Oxlint baseline;
- `@ylfjuk/oxc/oxfmt.json`: static Oxfmt baseline.

The dynamic Oxfmt API should accept only meaningful project variation, initially:

- npm scope, such as `ylfjuk`;
- internal import patterns, such as `@/`;
- optional Tailwind stylesheet path;
- optional Tailwind helper functions;
- additional ignore patterns.

The static Oxfmt baseline will include the universal preferences supplied for this migration:

- tabs with width 4;
- print width 100;
- semicolons;
- double quotes in JavaScript and JSX;
- `as-needed` property quoting;
- bracket spacing;
- trailing commas everywhere supported;
- parenthesized arrow parameters;
- LF endings;
- case-insensitive ascending import sorting;
- React import grouping;
- side-effect, builtin, external, internal/subpath, relative, style, and unknown group ordering;
- package JSON sorting without script sorting.

The static baseline must omit project-dependent values:

- scope-specific import group;
- internal aliases;
- Tailwind stylesheet and helpers;
- repository-specific ignores beyond genuinely universal generated/vendor files.

Tailwind sorting must be opt-in. Do not guess that a consumer uses Tailwind or assume a stylesheet path.

Oxlint can import a shared object through `oxlint.config.ts`. Oxfmt does not document equivalent
package-config inheritance, so consumers will either import the dynamic factory from their own
`oxfmt.config.ts` or pass the static JSON path explicitly with `-c`.

## tsdown ownership of package metadata

For `@ylfjuk/oxc`, enable tsdown export generation and treat it as the source of truth for compiled entry
points.

- Do not manually duplicate generated `exports`, `main`, `module`, or `types` fields.
- Use `exports.customExports` for static JSON subpaths that tsdown cannot infer.
- Keep `exports.legacy` disabled unless compatibility tests prove that legacy top-level fields are needed.
- Do not use `devExports` initially. npm does not honor the `publishConfig.exports` override on which that
  mode relies, even though pnpm pack/publish does.
- Enable tsdown-integrated `publint` and Are the Types Wrong validation in CI.
- Review and commit generated manifest changes.
- CI must fail if building changes a tracked `package.json` unexpectedly.
- Validate generated exports against the packed tarball, not only the workspace source tree.

Initial build intent:

- ESM only;
- declarations and declaration maps;
- JavaScript source maps;
- explicit entry points for each public dynamic subpath;
- Node target inferred from the approved `engines.node` field;
- no CommonJS output;
- no bundling of declared runtime/peer dependencies unless deliberately required.

## Migration phases

### Phase 0: Baseline and CI safety net

Tasks:

- Capture the current package file lists and export-resolution behavior.
- Add focused fixtures for every existing configuration package.
- Add a pull-request CI workflow with read-only repository permissions.
- Correct ineffective Turbo task wiring without changing package behavior.
- Establish non-writing check commands separately from explicit fix commands.

Likely files:

- `package.json`
- `turbo.json`
- `.github/workflows/ci.yml` (new)
- focused fixture/test files inside existing packages

Verification:

```sh
git status --short
npm pack --dry-run --json --workspaces
```

Acceptance:

- Baseline package contents are recorded.
- CI commands are non-mutating.
- The worktree remains clean after checks.

Rollback: remove the new workflow and fixtures and restore the original scripts.

### Phase 1: npm to pnpm and supported Node

Tasks:

- Add `pnpm-workspace.yaml` containing `packages/*` only.
- Change `packageManager` to `pnpm@11.20.0`.
- Add Node and pnpm engine requirements.
- Convert npm/npx scripts and documentation to pnpm/local binaries.
- Generate `pnpm-lock.yaml`.
- Delete `package-lock.json` only after the frozen pnpm install succeeds.
- Use Node 24 and frozen pnpm installation in CI.
- Review pnpm dependency-script approvals rather than enabling scripts broadly.

Likely files:

- `package.json`
- `pnpm-workspace.yaml` (new)
- `pnpm-lock.yaml` (new)
- `package-lock.json` (delete)
- `.gitignore`
- `README.md`
- `.github/workflows/*.yml`
- package READMEs

Risks:

- pnpm's strict isolation may expose undeclared dependencies.
- Install scripts may require explicit approval under current package-manager security behavior.
- Lockfile regeneration can change the advisory graph.

Verification:

```sh
pnpm install --frozen-lockfile
pnpm list --depth Infinity
pnpm audit
pnpm audit --prod
git status --short
```

Acceptance:

- Two consecutive frozen installs leave the lockfile unchanged.
- No undeclared-dependency failure occurs.
- No high or critical advisory remains.
- No npm command or npm lockfile remains in the normal development workflow.

Rollback: restore npm workspace metadata and `package-lock.json`; remove pnpm files.

### Phase 2: TypeScript 7 and shared tsconfigs

Tasks:

- Upgrade TypeScript and the `@ylfjuk/tsconfigs` peer range to 7.0.2.
- Run existing configs through TypeScript 7 before altering options.
- Remove or replace unsupported options rather than suppressing diagnostics.
- Exercise every exported config through a real consumer fixture.
- Test config extension from a packed tarball.
- Reassess `allowJs`, `isolatedModules`, `isolatedDeclarations`, `skipLibCheck`, declaration settings, and
  module syntax without changing consumer behavior unnecessarily.

TypeScript 7 constraint:

TypeScript 7.0 has no compiler API; a new API is planned for 7.1. This repository currently needs only
the `tsc` CLI, so adoption should be viable. If a required tool imports the TypeScript compiler API,
prove whether the documented TypeScript 6 compatibility package is needed. Do not add it preemptively.

Likely files:

- `packages/tsconfigs/package.json`
- `packages/tsconfigs/tsconfig*.json`
- `packages/tsconfigs/README.md`
- TypeScript consumer fixtures/tests
- root manifest and lockfile

Verification:

```sh
pnpm --filter @ylfjuk/tsconfigs test
pnpm exec tsc --showConfig --project packages/tsconfigs/tsconfig.base.json
pnpm exec tsc --showConfig --project packages/tsconfigs/tsconfig.lib.json
pnpm exec tsc --showConfig --project packages/tsconfigs/tsconfig.test.json
```

Acceptance:

- TypeScript 7 processes every exported configuration.
- Strictness is not weakened.
- Packed-package consumer fixtures succeed.

Approval gates:

- adding `verbatimModuleSyntax` where it changes consumers;
- enabling `exactOptionalPropertyTypes`;
- changing module, module-resolution, target, or lib defaults.

Rollback: pin the latest stable TypeScript 6 release and document the demonstrated TypeScript 7
incompatibility.

### Phase 3: Oxc migration and shared package

Tasks:

- Add `packages/oxc` at version `0.0.1`.
- Implement static Oxlint/Oxfmt configs and typed factories.
- Replace root Biome use with Oxlint and Oxfmt.
- Add separate `lint`, `lint:fix`, `format`, and `format:check` commands.
- Map Biome's recommended rules and `useImportType` behavior to supported Oxlint rules.
- Update the VS Code recommendation to `oxc.oxc-vscode`.
- Keep `packages/biome` published and structurally intact.
- Apply the one-time formatting/import-order diff separately from functional changes.

Likely files:

- `biome.json` (delete at root)
- root Oxlint config (new)
- root Oxfmt config (new)
- `package.json`
- `turbo.json`
- root/editor configuration
- `packages/oxc/**` (new)
- `README.md`
- lockfile

Risks:

- Oxfmt is stable-tagged but pre-1.0 and releases frequently.
- Oxlint and Biome rules are not one-to-one.
- Oxfmt import sorting can differ from both Biome and the Trivago Prettier plugin.
- Package JSON sorting will create a broad mechanical diff.
- A Tailwind path must never be enabled when the target stylesheet is absent.

Verification:

```sh
pnpm format:check
pnpm lint
pnpm exec oxlint --print-config packages/oxc/src/index.ts
pnpm exec oxfmt --check .
pnpm --filter @ylfjuk/oxc test
```

Acceptance:

- Check commands do not write files.
- Formatting is idempotent.
- Static and dynamic configs agree on their shared baseline.
- Node tests cover option merging and opt-in scope/internal/Tailwind behavior.
- No root script or CI workflow invokes Biome.

Approval gates:

- removing or materially changing `packages/biome`;
- accepting any public artifact removal from the legacy package;
- accepting the one-time formatting/import-order diff.

Rollback: restore root Biome configuration/scripts and remove the new package from the workspace. Do
not alter the already-published npm package.

### Phase 4: tsdown build and package tests

There is no existing tsup build to migrate. Apply tsdown only to the new executable TypeScript package.

Tasks:

- Configure tsdown for ESM, declarations, declaration maps, and source maps.
- Enable tsdown package-export generation.
- Add static JSON subpaths through `customExports` if required.
- Enable `publint` and Are the Types Wrong in CI.
- Test the built output with `node:test`.
- Install the packed tarball into a clean consumer fixture.

Likely files:

- `packages/oxc/tsdown.config.ts`
- `packages/oxc/src/*`
- `packages/oxc/test/*`
- generated fields in `packages/oxc/package.json`
- root task configuration and lockfile

Verification:

```sh
pnpm --filter @ylfjuk/oxc build
pnpm --filter @ylfjuk/oxc test
pnpm --filter @ylfjuk/oxc pack --pack-destination <temporary-directory>
git diff --exit-code -- packages/oxc/package.json
```

Acceptance:

- Every generated export resolves from the tarball.
- Static JSON subpaths resolve.
- `.js`, `.js.map`, `.d.ts`, and declaration-map paths are valid.
- No source, fixture, or unrelated file leaks into the package.
- The build is deterministic and does not leave an uncommitted manifest diff.
- No CommonJS artifacts are emitted.

Rollback: reduce `@ylfjuk/oxc` to static JSON only and remove tsdown/source code. Existing packages are
unaffected.

### Phase 5: Changesets, manifests, and package contents

Tasks:

- Upgrade Changesets to the current stable version.
- Update the Changesets schema reference.
- Remove unused `@changesets/changelog-github`, unless separately approved for actual use.
- Add explicit `files`, engines, repository metadata, and public `publishConfig` fields.
- Correct stale badges and repository links.
- Validate all package contents and exports.
- Assign appropriate Changesets release types for consumer-visible changes.

Likely files:

- `package.json`
- all `packages/*/package.json`
- `.changeset/config.json`
- package READMEs/changelogs
- lockfile

Verification:

```sh
pnpm exec changeset status
pnpm pack --dry-run --json --recursive
```

Acceptance:

- Each package contains only intended public files.
- Existing export paths still resolve.
- New Oxc exports resolve.
- Release types match compatibility impact.

Approval gates:

- any legacy published-file removal;
- package release bump levels;
- narrowing peer dependency ranges.

Rollback: restore previous manifests and Changesets configuration, then regenerate the lockfile.

### Phase 6: CI and trusted publishing

Tasks:

- Pin third-party GitHub Actions to reviewed full commit SHAs with version comments.
- Use Node 24 and pnpm frozen installation.
- Run format, lint, type-check, tests, build, audit, and package validation before release logic.
- Avoid duplicate builds.
- Grant only required permissions.
- Remove `NPM_TOKEN` from workflow configuration.
- Configure npm trusted publishers manually after workflow review.
- Keep automatic npm provenance enabled.

Minimum permissions:

- pull-request CI: `contents: read`;
- release job: `contents: write`, `id-token: write`;
- add `pull-requests: write` only if the Changesets action requires it under repository policy;
- no `packages: write` permission is required for npmjs.com.

Verification:

```sh
pnpm install --frozen-lockfile
pnpm verify
pnpm pack --dry-run --json --recursive
pnpm publish --dry-run --recursive
```

Acceptance:

- No long-lived npm publish credential appears in workflow configuration.
- Release builds use a GitHub-hosted runner.
- OIDC permission is job-scoped.
- Package repository URLs exactly match `https://github.com/YLfjuk/configs`.
- Provenance remains enabled.
- A publishing dry run does not create a release.

Rollback: restore token publishing temporarily only with explicit approval. Trusted-publisher settings
must be edited manually on npmjs.com.

### Phase 7: Final clean-room validation

Run from a clean checkout with no existing dependency or build directories:

```sh
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm test:types
pnpm test
pnpm build
pnpm audit
pnpm audit --prod
pnpm exec changeset status
pnpm pack --dry-run --json --recursive
pnpm publish --dry-run --recursive
git status --short
```

Also:

- install each tarball into an isolated consumer fixture;
- resolve every documented export with Node ESM;
- consume every JSON config from its packed location;
- import and exercise the dynamic Oxc API;
- verify source and declaration maps;
- compare package file lists with the baseline;
- confirm the release workflow contains no `NPM_TOKEN`;
- confirm checks and builds leave the worktree clean.

Final acceptance requires all commands to pass, zero high/critical advisories, no unintended artifact
changes, and no real publication.

## Parallel workstreams

After pnpm bootstrap and lockfile generation, these workstreams can proceed independently:

| Workstream      | Scope                                                     |
| --------------- | --------------------------------------------------------- |
| TypeScript      | TypeScript 7, tsconfig fixtures, peer compatibility       |
| Oxc             | Static configs, dynamic factories, migration parity       |
| Package hygiene | Manifests, documentation, file allowlists, tarball checks |
| CI/security     | PR workflow, action pinning, permissions, audits          |
| Release         | Changesets and trusted-publishing workflow preparation    |

Do not finalize package metadata until the Oxc entry points and tsdown-generated exports are stable.

## Sequential dependencies

1. Confirm the remaining publishing policy.
2. Capture baseline behavior and package contents.
3. Migrate npm to pnpm and regenerate the dependency graph.
4. Audit the new graph.
5. Validate TypeScript 7 and build the Oxc package in parallel.
6. Finalize tsdown-generated exports and package metadata.
7. Validate tarballs and consumer resolution.
8. Upgrade Changesets and finalize CI.
9. Configure npm trusted publishers manually.
10. Run dry-run or separately approved staged validation.
11. Run final clean-room validation.

## Trusted publishing

Use GitHub Actions OIDC rather than long-lived granular access tokens. Current npm requirements include:

- npm CLI 11.5.1 or later;
- Node 22.14.0 or later;
- a GitHub-hosted runner;
- `id-token: write`;
- an exact repository/workflow match in npm package settings.

GitHub trusted-publisher values for existing packages:

```text
Organization/user: YLfjuk
Repository: configs
Workflow filename: release.yml
Allowed action: npm publish
```

For each existing package, the user must configure the trusted publisher manually on npmjs.com. After
OIDC is proven, require 2FA and disallow tokens, revoke the old automation token, and remove the GitHub
`NPM_TOKEN` secret.

`@ylfjuk/oxc` needs a bootstrap publication because it does not yet exist:

1. Build and validate version `0.0.1`.
2. With separate explicit approval, publish `0.0.1` manually using interactive authentication and 2FA.
3. Configure its trusted publisher on npmjs.com.
4. Use OIDC for all subsequent releases.

### Optional protected GitHub environment

If a human approval gate is desired, create a GitHub environment named `npm` with the user as required
reviewer and add this to the release job:

```yaml
jobs:
    release:
        environment: npm
        permissions:
            contents: write
            pull-requests: write
            id-token: write
```

Every npm trusted-publisher configuration must then specify environment `npm` exactly. A mismatch causes
OIDC publication to fail.

The current Changesets action combines release-PR maintenance and publishing in one job. Protecting that
job would therefore require approval even on runs that only create or update the release PR. Splitting
those paths is possible but adds workflow complexity.

Current recommendation: direct OIDC publishing without a protected environment or staged publishing.
This remains pending user confirmation.

OIDC cannot be validated with `npm whoami`; the credential exchange occurs only during publish/stage.
Use pack and publish dry runs for local validation. Any staged registry validation is an external mutation
and requires separate explicit approval.

## Change classification

### Safe mechanical changes

- npm-to-pnpm command and lockfile conversion;
- stable dependency updates within approved constraints;
- action updates and SHA pinning;
- documentation corrections;
- non-writing check scripts;
- explicit package allowlists after artifact comparison;
- removal of confirmed unused dependencies;
- clean-install, audit, pack, and dry-run checks.

### Changes requiring technical judgment

- TypeScript 7 option compatibility;
- Biome-to-Oxlint rule mapping;
- Oxfmt import-order parity;
- Oxc factory API and peer ranges;
- tsdown declaration/source-map output;
- meaningful Node test coverage;
- package release types.

### Changes requiring explicit approval

- removing or renaming an existing package;
- changing an existing public export or intended artifact;
- adding CommonJS output;
- enabling consumer-visible TypeScript strictness/module changes;
- publishing, staging, releasing, or deprecating a package;
- changing GitHub secrets or npm settings;
- the first `@ylfjuk/oxc@0.0.1` publication;
- accepting any newly discovered behavior-breaking migration.

## Future-session checklist

Before implementation, a future session should:

1. Read this file and inspect the current worktree for changes since the baseline.
2. Recheck stable dependency versions and official migration guidance.
3. Confirm the remaining direct-OIDC/protected-environment decision.
4. Implement one phase at a time with its verification and rollback boundary.
5. Stop at every approval gate rather than inferring permission.
6. Update this file as decisions or constraints change.
7. Delete this file after the migration and final validation are complete.

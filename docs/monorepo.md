# Monorepo

Loaded when touching workspace config, `turbo.json`, `pnpm-workspace.yaml`,
shared tsconfig, or adding a package. Runner: **pnpm** + **Turborepo**.

> Based on the standard 2026 TypeScript monorepo stack: pnpm workspaces +
> Turborepo + TS project references + shared config. Layout is intentionally
> minimal (one app + one config package); add packages as real sharing emerges.

## Layout

```
apps/
  web/              # TanStack Start app (the single deployable)
packages/
  config/           # Shared tsconfig / eslint / tailwind presets (internal, not published)
pnpm-workspace.yaml
turbo.json
package.json        # root, private
```

- `apps/` = deployable artifacts. `packages/` = internal packages, never published
  unless you choose to.
- Add a new `packages/*` only when code is shared across deployables — don't pre-split.

## pnpm workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

Root `package.json` is `private: true`; scripts delegate to Turbo:

```json
{
  "name": "my-saas",
  "private": true,
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "^2.5.0",
    "typescript": "^5.8.0"
  }
}
```

## Shared TypeScript config

- Base in `packages/config/tsconfig/base.json`: `strict`, `noUncheckedIndexedAccess`,
  `composite: true`, `incremental: true`. `composite` is required for project references.
- Each app/package `tsconfig.json` extends the base, adding only what it needs:

```json
// apps/web/tsconfig.json
{
  "extends": "@my-saas/config/tsconfig/base.json",
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

- Use TypeScript project references for incremental builds across packages.
- No duplicate tsconfigs scattered around — extend the base.

## Turborepo pipeline

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".output/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "typecheck": { "dependsOn": ["^build"] },
    "lint": {},
    "test": { "dependsOn": ["^build"] }
  }
}
```

- `^build` is the magic: Turbo resolves the dependency graph and builds a package's
  dependencies before the package itself. No manual ordering.
- `dev` is `persistent` and uncached (long-running). `build`/`typecheck`/`test` are cached.

## Internal package imports

When you add a package, import it via the `workspace:*` protocol — never `npm link`
or relative path hacks:

```json
// packages/ui/package.json
{
  "name": "@my-saas/ui",
  "exports": { ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" } }
}

// apps/web/package.json
{ "dependencies": { "@my-saas/ui": "workspace:*" } }
```

- `workspace:*` always resolves to the local package, so shared lib versions never drift.
- Scope internal package names under a shared `@my-saas/` prefix.

## Versioning (optional)

- Use **Changesets** if/when you publish internal packages or need coordinated versioning.
- For a single-deployable SaaS, skip it until you actually publish.

## Conventions

- Path alias `@/*` → `apps/web/src/*` (configured in `apps/web/tsconfig.json` + `apps/web/vite.config.ts`).
- In these docs, bare `src/...` paths are relative to `apps/web/`; paths under `packages/` are monorepo-wide.
- Commit `pnpm-workspace.yaml`, `turbo.json`, and `packages/config/` to git.
- Run `pnpm install` at the repo root, not inside workspaces.
- Subdirectory `AGENTS.md` files merge with root (closer file wins). Add `apps/web/AGENTS.md` only when app-specific rules outgrow root — don't pre-create.

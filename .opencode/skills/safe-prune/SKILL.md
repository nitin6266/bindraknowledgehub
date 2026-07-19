---
name: safe-prune
description: Reviews the codebase to safely remove dead, redundant, or unrequired code, packages, and plugins without breaking functionality.
triggers: ["clean code", "remove dead code", "prune dependencies", "code review cleanup", "remove unused plugins"]
compatibility: opencode
---

# Safe Prune Workflow

You are an expert static analysis and code optimization agent. Your objective is to strip away technical debt, dead code, and unused library wrappers while ensuring system stability.

## Core Mandates

### 1. Dependency & Plugin Auditing
- Parse `package.json`, `pyproject.toml`, or relevant lockfiles.
- Search the codebase for references to each listed plugin/library.
- If a plugin or package has zero active imports or references, flag it for removal.
- Run your ecosystem's pruning tool (e.g., `npm prune`, `cargo prune`, or `depcheck`) to verify before suggesting removals.

### 2. Micro Dead-Code Sweeps
- Track unused imports, local variables, and unreachable `return` or `if/else` logical paths.
- Check exports: verify whether an exported helper is *actually* imported anywhere else in the repository before deleting it.
- Remove legacy "commented-out" code blocks that clog file readability.

### 3. Structural Redundancy Evaluation
- Look for duplicate utility logic (e.g., two different ad-hoc date formatters). Move logic to a shared utility and prune the duplicate.
- Identify redundant state variables or over-nested UI wrappers that serve no functional purpose.

## Absolute Safety Rules (Do Not Break)
1. **Test-Driven Safeguard**: You MUST run the existing test suite (`npm test`, `pytest`, etc.) BEFORE making any removals to establish a baseline.
2. **Atomic Changes**: Remove logic block-by-block. Never mass-delete files across multiple layers in a single pass.
3. **Verify via Tests**: After every deletion, rerun the test suite or build tool. If a test fails or the compilation breaks, immediately revert the change and log the edge case.
4. **Respect Public Entry Points**: Never remove methods or configurations that are required for public APIs, webhooks, or explicit deployment targets, even if they aren't called locally.

## Node.js & Next.js Ecosystem Rules

### 1. Automated Dependency Discovery
- You must leverage `knip` or `depcheck` via the terminal (`npx knip` or `npx depcheck`) to locate unused dependencies, unreferenced exports, and orphaned files across the workspace.
- Check `package.json` for old styling engines (like unused `sass` or legacy `styled-components`), dead linting plugins, or redundant utility libraries (like `lodash` if native optional chaining/array methods can replace it).

### 2. Next.js Routing and Dead File Audits
- Check the routing structure (`/pages` or `/app` directory). 
- Verify if any page, layout, or API route file is completely empty, commented out, or disconnected from the active application flow.
- Look out for dead custom hooks (`/hooks`), unused UI components (`/components`), and legacy context files.

### 3. Safety Controls for Next.js
- **Dynamic Routing Exception**: Do not delete files matching `[id]`, `[...slug]`, `page.js`, `layout.js`, or `route.js` solely based on text scanning. These are framework entry points.
- **Server Actions & Config**: Never prune `next.config.js`, `postcss.config.js`, or `tailwind.config.js`.
- **Functionality Verification**: Run `npm run build` or `yarn build` after any deletion pass. If the Next.js compiler throws an error, rollback the change immediately.

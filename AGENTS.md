# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the Astro site code: `pages/`, `layouts/`, `components/`, `styles/`, and `utils/`.
- `src/content/` holds MDX content; blog posts follow `YYYYMMDD-slug.mdx`.
- `public/` stores static assets copied as-is.
- `docs/` contains generated documentation content; update via the docs script.
- `plugins/` and `scripts/` house custom remark plugins and maintenance utilities.
- `dist/` is build output and should be treated as generated.

## Build, Test, and Development Commands
- `npm run dev` starts the local Astro dev server.
- `npm run build` generates the production static build in `dist/`.
- `npm run preview` serves the built site locally for verification.
- `npm run deploy` deploys to Cloudflare Workers via Wrangler.
- `npm run docs:update` regenerates API docs into `docs/`.

## Coding Style & Naming Conventions
- Formatting is enforced with Prettier; config lives in `.prettierrc`.
- Indentation uses tabs with a width of 4; `printWidth` is 120 (Markdown is 80).
- Use single quotes and trailing commas where supported.
- JSDoc is required for exported functions: include a short summary, `@param` tags for all inputs, and `@returns` (use `Promise<T>` for async; omit `@returns` for void).
- Use `@typedef`/`@property` for options objects and document optional params with `[]` syntax (e.g., `@param {string} [label]`).
- Keep Astro components in `src/components/` and shared helpers in `src/utils/`.

## Testing Guidelines
- No automated test runner is configured for this repo.
- Validate changes by running `npm run dev` and checking affected pages.
- For build regressions, run `npm run build` and `npm run preview`.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, and unprefixed (e.g., “refactor typedoc utils”).
- PRs should describe the change, include before/after screenshots for UI updates,
  and link relevant issues or discussions when available.

## Configuration & Deployment Notes
- Astro and MDX settings live in `astro.config.mjs`.
- Cloudflare Worker settings are in `wrangler.jsonc`; keep deploy-specific edits minimal.

## Agent Workflow
- Provide a brief rationale before triggering the CLI approval prompt for any file edits.
- Do not ask for a separate confirmation after the rationale; proceed directly to the edit.
- Do not start an edit until the rationale has been stated.
- Do not request written confirmation; trigger the CLI approval prompt immediately after the rationale.
- Warn if the current Git branch is `main` before making any changes; only proceed after the user confirms to switch branches.

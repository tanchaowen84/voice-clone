# Repository Guidelines

## Project Structure & Module Organization
- Code: `src/` (Next.js app in `src/app`, UI in `src/components`, data in `src/db`, config in `src/config`, utilities in `src/lib`/`src/utils`).
- Content & docs: `content/` with generation via `content-collections`.
- Public assets: `public/`.
- Scripts: `scripts/` (e.g., asset upload, seeding).
- Types: `src/types`, styles: `src/styles`, i18n: `src/i18n`.

## Build, Test, and Development Commands
- Dev server: `pnpm dev` — runs content watcher and `next dev`.
- Build: `pnpm build` — generates content then `next build`.
- Start: `pnpm start` — production server.
- Lint (write-safe): `pnpm lint` — Biome check and write.
- Format: `pnpm format` — Biome format write.
- Database: `pnpm db:generate` | `pnpm db:migrate` | `pnpm db:push` | `pnpm db:studio`.
- Docs build: `pnpm docs`.
- Email previews: `pnpm email` (templates in `src/mail/templates`).

## Coding Style & Naming Conventions
- Language: TypeScript + React (Next.js 15, app router).
- Formatting/Linting: Biome (see `biome.json`). Run before committing.
- Indentation: 2 spaces; semicolons standard TS defaults.
- Filenames: kebab-case for files (e.g., `voice-input-area.tsx`), PascalCase for exported React components, named exports preferred in libs.
- Paths: co-locate components, hooks, and styles by feature where practical (`src/components/<feature>`).

## Testing Guidelines
- Current: No formal automated tests in repo. For changes, provide manual QA steps in PR (pages touched, browsers, screenshots). 
- Recommendation: prefer adding unit tests (Vitest) and e2e (Playwright) for critical flows when introducing new modules.

## Commit & Pull Request Guidelines
- Commits: Conventional style (e.g., `feat: add voice recorder page`, `fix: handle null audio input`). Keep subjects imperative; scope optional.
- PRs must include:
  - Clear description and rationale; link issues (e.g., `Closes #123`).
  - Screenshots/GIFs for UI changes; before/after when relevant.
  - Notes on env, DB, or content tasks (e.g., `pnpm db:migrate`, required `.env` keys).
  - Checklist of manual QA performed.

## Security & Configuration Tips
- Env: copy `env.example` → `.env`; never commit secrets. 
- Storage/DB: use Drizzle migrations; avoid ad‑hoc SQL.
- Deployment: Vercel (`vercel.json`). Validate build with `pnpm build` before merging.

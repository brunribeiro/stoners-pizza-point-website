# Repository Guidelines

## Project Structure & Module Organization

This Next.js app serves routes from `pages/` (checkout, settings, thankyou) and composes views through feature folders under `components/` and `shared/`. Form schemas live in `schema/` with Yup. Domain hooks sit in `hook/`, cross-cutting utilities in `hooks/`. Reusable UI primitives stay in `widgets/`, while API clients are grouped under `services/`. Static assets belong in `public/`, and Tailwind plus global styles live in `styles/`. Configuration helpers such as `lib/config.js` and `withSession.js` centralize environment-aware logic.

## Build, Test, and Development Commands

Install dependencies with `yarn install` (pnpm also works). Run `yarn dev` to serve the app on port 1124, `yarn build` for a production bundle, and `yarn start` or `yarn start-prod` to host the compiled output on 8124 or 8010. Execute `yarn lint` or `yarn check-lint` before opening a pull request, and apply formatting via `yarn format`. Regenerate optimized WebP assets with `yarn convert-images`.

## Coding Style & Naming Conventions

Follow `.eslintrc.json`: prefer single quotes, enforce `eqeqeq`, keep import groups separated by blank lines, and favor arrow functions plus `const`. Use PascalCase filenames for components, camelCase for helpers and hooks (e.g. `useSearch.js`), and kebab-case for directories. Keep Tailwind class strings concise and collocate any CSS modules with the component they serve.

## Testing Guidelines

An automated suite has not shipped yet; add React Testing Library or Playwright coverage alongside new features. Name tests `MyComponent.test.jsx` and keep fixtures under `__fixtures__/`. Until CI is defined, manually run accessibility and smoke passes through the key flow (home → menu → checkout) before submitting.

## Commit & Pull Request Guidelines

Adopt the existing Conventional Commit prefixes (`perf:`, `a11y:`, `feat:`) and write imperative subjects that reference issues when available. Every pull request should include a brief summary, UI screenshots or recordings when visuals change, a manual-verification checklist (lint, build, critical flows), and any environment variables touched. Request review from the feature owner and wait for at least one approval before merging.

## Environment & Deployment Notes

Copy `.env.local.example` to `.env.local` and supply map keys, PostHog tokens, and Incentivio endpoints before running `yarn dev`. Use `next-deploy.js` with the `serve` scripts when rolling updates to PM2-managed instances.

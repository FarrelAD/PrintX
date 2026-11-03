## Description

Please provide a summary of the change and which issue it fixes. Include relevant motivation and context.

Fixes #(issue)

## Type of change

Please delete options that are not relevant.

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactor (no functional change)
- [ ] Localization / i18n update (`app/locales/`)
- [ ] Documentation update
- [ ] CI/CD or infrastructure change (`.github/`)

## Component affected

- [ ] Landing Page & Routing (`app/pages/`, `app/routes/`)
- [ ] Dashboard, Projects & Datasets Views (`app/views/`, `app/layouts/`)
- [ ] Project Wizard — Step 1–2 (Category & Assets Upload)
- [ ] Project Wizard — Step 3 (Konva Canvas & Data Mapping)
- [ ] Project Wizard — Step 4 (Record Preview & QR Rendering)
- [ ] Project Wizard — Step 5 (Print Config & PDF/N-Up Generator)
- [ ] Client Storage / IndexedDB & PWA (`app/lib/db.ts`, `app/context/`)
- [ ] Localization / i18n (`app/locales/en.json`, `app/locales/id.json`, `app/lib/i18n.ts`)
- [ ] Automated Tests (`tests/`)
- [ ] CI/CD Workflows (`.github/workflows/`)

## How Has This Been Tested?

Please describe the tests that you ran to verify your changes.

- [ ] `pnpm run format:check` passes
- [ ] `pnpm run typecheck` passes
- [ ] `pnpm run lint` passes
- [ ] `pnpm run test` (Vitest unit & i18n parity suite) passes
- [ ] `pnpm run build` passes and generates client/prerender artifacts
- [ ] Tested manually in browser (`pnpm run dev`) across both Indonesian (`ID`) and English (`EN`) locales

## Checklist

- [ ] My code follows the style and Editorial Design System guidelines of this project (see [CONTRIBUTING.md](../CONTRIBUTING.md) and [docs/DESIGN.md](../docs/DESIGN.md))
- [ ] I have performed a self-review of my code
- [ ] All new UI strings use `t('...')` and are registered in both `app/locales/en.json` and `app/locales/id.json`
- [ ] I have added or updated tests that prove my fix/feature works
- [ ] I have made corresponding changes to the documentation if needed
- [ ] No secrets, credentials, or `.env` files are included

## PR title convention

The PR title must follow the [Conventional Commits convention](../CONTRIBUTING.md#commit-message-guidelines), e.g.:

- `feat(wizard): ...`
- `fix(i18n): ...`
- `docs: ...`

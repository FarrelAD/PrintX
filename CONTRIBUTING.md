# Contributing to PrintX

We would love for you to contribute to **PrintX** and help make bulk document automation and mail-merge printing on the web even better! As a contributor, here are the guidelines we follow:

- [Code of Conduct](#code-of-conduct)
- [Found a Bug or Missing a Feature?](#found-a-bug-or-missing-a-feature)
- [Submission Guidelines](#submission-guidelines)
  - [Submitting an Issue](#submitting-an-issue)
  - [Submitting a Pull Request (PR)](#submitting-a-pull-request-pr)
- [Development Setup](#development-setup)
  - [Prerequisites](#prerequisites)
  - [Install Dependencies](#install-dependencies)
  - [Run Locally](#run-locally)
  - [Quality Checks & Testing](#quality-checks--testing)
- [Architecture & Coding Rules](#architecture--coding-rules)
  - [Project Structure](#project-structure)
  - [Editorial Design System](#editorial-design-system)
  - [Localization (i18n) Parity](#localization-i18n-parity)
- [Branch Naming](#branch-naming)
- [Commit Message Guidelines](#commit-message-guidelines)

---

## Code of Conduct

Help us keep this project open and inclusive. Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Found a Bug or Missing a Feature?

- If you find a bug in the source code, please [submit an issue](#submitting-an-issue) using our Bug Report template, or submit a Pull Request with a fix and accompanying test.
- If you want to propose a new feature, open a Feature Request issue so we can align on the design before implementation.

---

## Submission Guidelines

### Submitting an Issue

Before submitting an issue, search the issue tracker to check if a similar report already exists. Use our structured issue forms:

- **Bug reports** — [`.github/ISSUE_TEMPLATE/bug_report.yml`](./.github/ISSUE_TEMPLATE/bug_report.yml)
- **Feature requests** — [`.github/ISSUE_TEMPLATE/feature_request.yml`](./.github/ISSUE_TEMPLATE/feature_request.yml)

### Submitting a Pull Request (PR)

1. **Fork** the repository or create a feature branch from `dev` / `master`.
2. Create your branch using our [Branch Naming](#branch-naming) convention:
   ```bash
   git checkout -b feat/wizard/custom-paper-presets
   ```
3. Implement your changes following the [Architecture & Coding Rules](#architecture--coding-rules).
4. Ensure all new UI text is added to **both** `app/locales/en.json` and `app/locales/id.json`.
5. Run all quality checks locally:
   ```bash
   pnpm run format:write
   pnpm run typecheck
   pnpm run lint
   pnpm run test
   pnpm run build
   ```
6. Commit your changes using [Conventional Commits](#commit-message-guidelines) and open a Pull Request using the [PR template](./.github/pull_request_template.md).
7. All Pull Requests must pass the automated **`PR Verification Gate`** workflow (`.github/workflows/pr-check.yml`) before merging.

---

## Development Setup

### Prerequisites

| Tool        | Version                          | Notes                                                                                          |
| :---------- | :------------------------------- | :--------------------------------------------------------------------------------------------- |
| **Node.js** | `>=22.22.0` (`24.x` recommended) | Pinned via [`.node-version`](./.node-version) & [`.nvmrc`](./.nvmrc)                           |
| **pnpm**    | `>=10.0.0` (`11.18.0` pinned)    | Enforced via `packageManager` in [`package.json`](./package.json). Do not use `npm` or `yarn`. |

### Install Dependencies

```bash
pnpm install
```

### Run Locally

Start the React Router / Vite development server with Hot Module Replacement (HMR):

```bash
pnpm run dev
```

### Quality Checks & Testing

```bash
# Check code formatting (Prettier)
pnpm run format:check

# Auto-fix code formatting
pnpm run format:write

# Run React Router type generation & TypeScript compiler check
pnpm run typecheck

# Run ESLint static analysis
pnpm run lint

# Run Vitest unit & i18n integrity test suite
pnpm run test

# Run full production build & prerendering verification
pnpm run build
```

---

## Architecture & Coding Rules

### Project Structure

- **`app/pages/` & `app/routes/`** — Landing page, OG generator, and React Router v8 route definitions (`ssr: false` prerendered SPA).
- **`app/views/` & `app/layouts/`** — Dashboard shell, projects management, datasets viewer, and the 5-step Project Wizard container.
- **`app/components/wizard/`** — Modular steps for Bulk Document Generation:
  - `Step1Category.tsx` — Project category selection (ID Card, Certificate, Label, Custom).
  - `Step2Assets.tsx` — Base template image upload (`JPG/PNG`) and spreadsheet dataset ingestion (`CSV/XLSX` via `xlsx`).
  - `Step3Mapping/` — Interactive `react-konva` visual canvas for positioning text & dynamic QR code fields.
  - `Step4Result/` — Record-by-record live preview prior to batch export.
  - `Step5Print.tsx` — Print layout configuration (Paper size, Portrait/Landscape, N-Up imposition, Bleed, Crop Marks) and high-DPI PDF generation.
- **`app/utils/pdf/`** — High-resolution canvas rendering, crop-mark drawing, and multi-page `jspdf` batch generator.
- **`app/lib/db.ts`** — Client-side persistence using IndexedDB (`idb`) so user datasets and templates remain 100% private in the browser.
- **`app/locales/`** — Bilingual localization dictionaries (`en.json` and `id.json`).

### Editorial Design System

PrintX follows a strict **Minimalist, Editorial & Grid-Based Design System** inspired by traditional print stationery (see [`docs/DESIGN.md`](./docs/DESIGN.md)):

- Prioritize crisp 1px borders (`border-primary`, `border-outline-variant`), high-contrast monochrome surfaces, and structured typography (`Newsreader` headings + `Inter` UI/body).
- Avoid arbitrary gradients or unstyled rounded corners that conflict with the industrial print aesthetic.

### Localization (i18n) Parity

- Never hardcode user-facing strings in components. Always use `useTranslation()` and `t('namespace.key')`.
- Every key added to `app/locales/en.json` **must** have an exact corresponding translation in `app/locales/id.json` (and vice-versa).
- Our automated test suite (`tests/i18n.test.ts`) scans the entire `app/` directory and fails CI if any key is missing in either language.

---

## Branch Naming

Use lower-case prefix conventions:

- `feat/<scope>/<short-description>` (e.g., `feat/wizard/nup-grid-preview`)
- `fix/<scope>/<short-description>` (e.g., `fix/i18n/step3-mapping-keys`)
- `docs/<short-description>` (e.g., `docs/contributing-guide`)
- `refactor/<scope>/<short-description>`
- `chore/<scope>/<short-description>`

---

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <short description>
```

**Allowed Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Formatting or whitespace changes (no functional change)
- `refactor`: Code refactoring without changing external behavior
- `test`: Adding or updating automated tests
- `chore`: Tooling, dependency updates, or CI/CD changes

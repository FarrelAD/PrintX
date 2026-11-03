# Security Policy

The security and client-side data privacy of **PrintX** users are of paramount importance. PrintX is architected as a local-first Progressive Web Application (PWA) where uploaded designs and spreadsheet datasets (`CSV/XLSX`) are processed entirely in the browser and stored locally via IndexedDB.

---

## Supported Versions

| Version                   | Supported | Notes                                            |
| :------------------------ | :-------- | :----------------------------------------------- |
| `master` / `dev` (Latest) | ✅        | Actively maintained and audited via automated CI |
| Older commits             | ❌        | Please upgrade to the latest release             |

---

## Reporting a Security Vulnerability

If you discover a security vulnerability (such as Cross-Site Scripting via dataset ingestion, malicious file parsing, or dependency vulnerabilities):

1. **Do NOT open a public GitHub issue.**
2. **Report privately**:
   - Submit a report via [GitHub Security Advisories](https://github.com/FarrelAD/PrintX/security/advisories/new), or
   - Email the maintainer directly at **farrel.apeiron@gmail.com**.
3. **Include details**:
   - Description of the vulnerability and potential impact.
   - Step-by-step reproduction instructions or proof-of-concept file.
   - Affected component (`app/components/wizard/`, `app/utils/pdf/`, etc.).

We will acknowledge receipt within **48 hours** and coordinate remediation before public disclosure.

---

## Automated Security Guardrails

- **Secret Leak Prevention (Gitleaks)**: Every Pull Request is scanned with Gitleaks (`.gitleaks.toml`) in `.github/workflows/pr-check.yml`.
- **Dependency Vulnerability Auditing**: `pnpm audit --audit-level high` runs automatically on every Pull Request and production deployment, complemented by weekly Dependabot updates (`.github/dependabot.yml`).
- **Client-Side Data Privacy**: User datasets and design templates never leave the client device; all PDF synthesis (`jspdf`, `konva`) executes locally inside the browser sandbox.

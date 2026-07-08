# Changelog

Loaded when writing or editing release notes / changelog entries. The changelog
is the **user-facing** record of what shipped — it builds trust, cuts support
tickets, and drives adoption. Source of truth: `CHANGELOG.md` at repo root.

## How entries are produced

- Drafted from conventional commits (`feat:`, `fix:`) since the last release, then
  rewritten into user-friendly prose. The agent can draft; a human reviews tone.
- One release = one dated section in `CHANGELOG.md`. Don't edit past releases
  except to fix a typo.

## Every entry answers

What changed? Who does it affect? Why should they care?

## Writing rules

- **User-focused headlines, plain language.** "Export to CSV" not "Enhanced data
  portability." If a non-technical user can't understand it, rewrite.
- **1–3 sentences.** Explain the benefit; skip implementation details users don't
  need.
- **Group by type:** Breaking (lead with it) → New → Improved → Fixed.
- **Date every release** in ISO (`2026-07-02`).
- **One entry per change** — never bundle unrelated updates.
- **Lead with breaking changes** and link a migration path.
- **Consistent tone** — pick we/you and stick to it.
- **Link when helpful** — to docs, help, or the in-app feature.

## Good vs bad

- Good: "Export to CSV — download any table as CSV. Useful for reporting and
  backups. [Docs →](/docs)"
- Bad: "Added export functionality."

- Good: "Fixed: calendar showed the wrong timezone for recurring events. Cross-
  timezone scheduling should now be correct."
- Bad: "Fixed timezone bug."

- Good: "Dark mode on mobile — toggle it in Settings. Easier on the eyes at night."
- Bad: "UI improvements for mobile."

## Publishing

- `CHANGELOG.md` is the source of truth (version-controlled, simple).
- For readership, render it at a `/changelog` route in the app, and/or add an
  in-app widget + email digest (e.g. AnnounceKit) once adoption matters — a static
  page alone gets few views.
- Breaking changes go to the in-app notification / email too, not just the file.

## Maintenance

- Update `CHANGELOG.md` in the same PR that ships the change — never batch later.
- Prune entries only when archiving a release to a `/changelog/archive` view.

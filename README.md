# Ravrent Interactive

The official studio website at **https://ravrentinteractive.vercel.app/**. This is the maintained source repository for the existing Vercel project `ravrentinteractive`, project ID `prj_yQ4JXuJUnof3PJzS7I14f3rd3iu6`.

## Public portfolio

| Project | Category | Stage | Public link |
| --- | --- | --- | --- |
| Ravrent Mechanic | Automotive assistant | Private beta | Not linked publicly |
| Outmile | Navigation | Prototype | https://ravrent-explore.vercel.app/ |
| Motor Dynasty | Automotive simulation | Playable prototype | https://motor-eta-six.vercel.app/ |
| Block Frontier | Sandbox game | Early prototype | https://block-frontier.hatchable.site |
| Life OS | Life/business simulation | In development | Not publicly released |

Private projects and internal systems are intentionally excluded from the public project catalog. The small footer research note is informational only and has no destination link.

## Structure

- `index.html` — semantic homepage, five project sections, real public prototype links, and modal shell
- `site.css` — responsive design system, product visuals, reduced-motion support
- `site.js` — dialogs, mobile navigation, interactive studio design studies, accessibility controls
- `icon.svg`, `manifest.webmanifest` — original app identity
- `sw.js` — network-first versioned asset cache; clears prior cache versions
- `tests/site.test.mjs` — dependency-free regression checks
- `.github/workflows/checks.yml` — GitHub Actions validation on pushes and pull requests

Graphics on the studio site are **illustrative design studies**, not genuine screenshots or confirmed functioning interfaces of the separate apps. The Outmile map is entirely fictional, and the Mechanic demo does **not** call an AI provider.

## Local development

Serve the directory with a local static server, for example:

```sh
python3 -m http.server 8000
```

Run tests with:

```sh
node --test tests/site.test.mjs
```

No package installation is required.

## Deployment

The published production project is the pre-existing Vercel project `ravrentinteractive` and domain `ravrentinteractive.vercel.app`.

**Git connection must be checked in Vercel Settings → Git.** Committing source to this repo and separately deploying through the Vercel API does not itself establish automatic deploy-on-push. Avoid importing this repository as a new Vercel project or reassigning the domain.

## Privacy and beta restrictions

No API keys are in this repository. Ravrent Mechanic is a private beta without unrestricted public access from this studio site. Do not add a direct chat endpoint until durable account identity, usage controls, quota monitoring, and abuse protection are in place.


## V9 project explorer (2026-10-15)

The project directory supports searching five project names, descriptions and feature lists; application/game and availability filters; local-only saved projects; and two-or-three-project comparison. Comparison tables use actual development status and available prototype links, not invented product scores. Visitors can copy a summary or share a comparison URL using the compare query parameter; individual project detail dialogs support direct hash links.

The new explorer.mjs module exports pure functions tested by tests/explorer.test.mjs. The existing site.js owns the same canonical project data and existing animated design previews. Project index links remain navigable if scripting is disabled; enhanced controls are shown only when the new module initializes.

The development checklist is maintained in DEVELOPMENT.md. Vercel's source integration is still not confirmed as connected. No separate project was created.

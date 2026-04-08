# Changelog

Notable changes to **Credit Hackr** are listed here. This project follows semantic versioning (`MAJOR.MINOR.PATCH`). Record new work under **`[Unreleased]`** first, then roll entries into a dated release when you ship.

## [Unreleased]

### Added

- Site-wide SEO: per-route meta titles, descriptions, keywords, canonical URLs, Open Graph/Twitter tags, and JSON-LD (Organization, WebSite with SearchAction, WebPage, CollectionPage, CreditCard, WebApplication, existing blog schemas).
- Public `robots.txt` (including common AI crawler user-agents) and `llms.txt` for machine-readable site summary and URL map.
- Changelog page on the site and this `CHANGELOG.md` file to track changes over time.
- Card comparison experience on `/cards`: category + numeric filters, selectable compare list (up to 4 cards), and side-by-side comparison table.
- Backend filtering support in `GET /api/cards` for search/category/fee/rate thresholds and explicit card IDs.
- Event tracking pipeline: frontend tracking utility, backend events ingest/summary API (`/api/events`), events schema/indexes, and dashboard route (`/dashboard`) with totals and daily trends.
- Recommendation system: quiz route (`/quiz`), ranking API (`POST /api/recommendations`), weighted scoring logic, top-pick explanations, and instrumentation for quiz funnel events.
- Navigation updates for new product areas (Dashboard and Quiz links in desktop/mobile navbar).

## [0.1.0] - 2026-04-06

### Added

- Eight long-form blog articles focused on Australian credit cards (frequent flyer points, cashback vs points, travel insurance, first rewards card, credit scores and applications, balance transfers, supermarket loyalty, premium card break-even).
- Blog SEO: meta descriptions, keywords, Open Graph and Twitter meta tags, canonical URLs, and JSON-LD (`BlogPosting` and blog index).
- Slug-based blog URLs with continued support for legacy numeric `/blog/:id` links.
- Estimated reading time and descriptive banner alt text on blog posts.
- Default site meta tags in `index.html`.

### Changed

- Blog list and articles expanded for depth and engagement; refreshed dates and structure for ongoing maintenance.

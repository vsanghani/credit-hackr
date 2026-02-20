# Credit Hackr

> ⚠️ **Internal Use Only** — This repository is for internal staff only. Do not share access or content externally.

A React-based web application for exploring and comparing credit card offers, calculating rewards, and reading credit-related blog content.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev/) with [Vite](https://vitejs.dev/) |
| Routing | [React Router DOM v6](https://reactrouter.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Styling | Vanilla CSS (per-component stylesheets) |
| Linting | ESLint |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Project Structure

```
credit-hackr/
├── index.html                  # App entry point (HTML shell)
├── vite.config.js              # Vite configuration
├── package.json                # Project metadata & scripts
│
└── src/
    ├── main.jsx                # React DOM root render
    ├── App.jsx                 # Root component & route definitions
    ├── App.css                 # Global app styles
    ├── index.css               # Base/reset styles & CSS variables
    │
    ├── components/             # Reusable UI components
    │   ├── Card.jsx            # Credit card display card
    │   ├── Card.css
    │   ├── Navbar.jsx          # Top navigation bar
    │   ├── Navbar.css
    │   ├── Footer.jsx          # Site footer
    │   ├── Footer.css
    │   ├── MeshBackground.jsx  # Animated mesh background
    │   └── MeshBackground.css
    │
    ├── pages/                  # Route-level page components
    │   ├── Home.jsx            # Landing / home page
    │   ├── Home.css
    │   ├── CardsPage.jsx       # Browse all credit cards
    │   ├── CardDetail.jsx      # Individual card detail view
    │   ├── CardDetail.css
    │   ├── HackrCalculator.jsx # Rewards calculator tool
    │   ├── HackrCalculator.css
    │   ├── BlogList.jsx        # Blog post listing page
    │   ├── BlogList.css
    │   ├── BlogPost.jsx        # Individual blog post view
    │   └── BlogPost.css
    │
    └── data/                   # Static data / mock content
        ├── cardsData.js        # Credit card definitions & details
        └── blogsData.js        # Blog post content
```

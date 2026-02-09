# Sudoku

A modern Sudoku game built with Angular.

**Play now:** https://lipata.github.io/sudoku/

## Features

- **Difficulty levels**: Easy, Medium, Hard, and Random
- **Easy mode assistance**: Invalid numbers are highlighted in red and automatically disappear
- **Keyboard navigation**: Use Arrow keys or WASD to navigate, 1-9 to enter numbers, Backspace to clear
- **Click to select**: Click any cell to select it
- **Responsive design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: [Angular 21](https://angular.dev/) with standalone components
- **State Management**: Angular Signals
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Template Syntax**: New control flow (`@if`, `@for`)
- **Testing**: [Vitest](https://vitest.dev/)
- **SSR**: Server-side rendering with hydration
- **API**: [Sugoku API](https://sugoku.onrender.com/) for puzzle generation
- **CI/CD**: GitHub Actions with deployment to GitHub Pages

## Development

### Prerequisites

- Node.js 22.x or 24.x
- npm

### Setup

```bash
npm install
```

### Development server

```bash
npm start
```

Open http://localhost:4200/ in your browser.

### Build

```bash
npm run build
```

### Run tests

```bash
npm test
```

### Build for GitHub Pages

```bash
npm run build:pages
```

## Project Structure

```
src/app/
├── core/services/          # API service
├── features/game/
│   ├── components/
│   │   └── board/          # Board and cell components
│   └── pages/game-page/    # Main game page
├── models/                 # TypeScript interfaces
└── utils/                  # Keyboard and validation utilities
```

---

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.3.

© 2026 Lipata. All rights reserved.
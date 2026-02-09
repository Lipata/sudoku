# Sudoku

A modern Sudoku game built with Angular.

**Play now:** https://lipata.github.io/sudoku/

## Features

- **Difficulty levels**: Easy, Medium, Hard, and Random
- **Easy mode assistance**: Invalid numbers are highlighted in red and automatically disappear
- **Keyboard navigation**: Arrow keys or WASD to navigate, Tab/Shift+Tab for next/previous empty cell, Home/End for row start/end, PageUp/PageDown for column start/end, Escape to deselect, 1-9 to enter numbers, Backspace to clear
- **Contextual keyboard hints**: Visual keyboard shortcuts displayed on desktop - navigation hints at top right, input hints at center right when a cell is selected
- **Click to select**: Click any cell to select it
- **Mobile cell input popup**: Tap a cell to open a number picker popup; in Easy mode, invalid numbers are filtered out
- **Desktop number pad**: Collapsible number pad for mouse/touch input
- **Validation and solve**: Validate your solution or reveal the answer with confirmation dialogs
- **Number highlighting**: Selecting a cell highlights all cells with the same number (Easy/Medium only)
- **PWA support**: Installable as a standalone app on mobile and desktop
- **Responsive design**: Optimized for both desktop and mobile devices

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
│   │   └── board/
│   │       ├── cell/           # Individual cell component
│   │       ├── cell-input/     # Mobile number picker popup
│   │       ├── keyboard-hints/ # Contextual keyboard shortcuts
│   │       ├── number-pad/     # Desktop number input pad
│   │       └── popup/          # Validation/confirmation popups
│   └── pages/game-page/    # Main game page
├── models/                 # TypeScript interfaces
└── utils/                  # Keyboard and validation utilities
```

---

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.3.

© 2026 Lipata. All rights reserved.
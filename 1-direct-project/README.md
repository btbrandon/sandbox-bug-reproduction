# Direct Project - MapLibre Test

This is the **reference implementation** - a direct Remix project with MapLibre GL JS that demonstrates how the code should work when run directly in your IDE. This serves as the baseline for comparison with the sandbox version.

## Purpose

This project shows the **expected behavior** of MapLibre GL JS with Tailwind CSS styling when executed in a standard development environment. Use this as a reference when comparing against the sandbox server output.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Expected Behavior

You should see a complete interactive map interface with:

### UI Components:

- **Layer Panel** (top-left): Semi-transparent panel with checkboxes to toggle layer visibility
  - "Tallest Towers" - Blue markers for world's tallest buildings
  - "Largest Waterfalls" - Light blue markers for major waterfalls
  - "7 Wonders" - Orange markers for the New 7 Wonders of the World
- **Header Panel** (top-right): "World Landmarks Map" title with description
- **Interactive Map**: Full-screen MapLibre GL JS map with proper styling

### Map Features:

- Various colored circular markers representing different landmark categories
- Markers positioned correctly across the globe (not just San Francisco)
- Clickable markers that show popups with landmark details
- Layer toggles that dynamically show/hide marker groups
- Proper Tailwind CSS styling with backdrop blur effects on panels

## Technology Stack

- **Remix**: Full-stack React framework
- **MapLibre GL JS**: Open-source map rendering library
- **Tailwind CSS**: Utility-first CSS framework with custom backdrop effects
- **Radix UI**: Accessible component primitives (checkboxes, icons)
- **Vite**: Build tool and development server
- **TypeScript**: Type-safe JavaScript with full component typing

## Key Files

- `app/routes/_index.tsx`: Main page with MapLibre map component and layer data
- `app/components/Map.tsx`: MapLibre GL JS wrapper with markers and popups
- `app/components/LayerPanel.tsx`: Interactive layer control panel with Radix UI components
- `tailwind.config.ts`: Tailwind configuration with custom styling
- `vite.config.ts`: Vite build configuration

## Features

- **Interactive Map**: MapLibre GL JS with world landmarks data
- **Layer Management**: Toggle visibility of different landmark categories
- **Rich UI**: Semi-transparent panels with backdrop blur effects
- **Responsive Design**: Components that work across different screen sizes
- **Radix UI Integration**: Accessible checkbox components for layer controls
- **TypeScript**: Full type safety for map data and component props

## Notes

This project uses the exact same base files as the sandbox environment, so any differences in behavior between this and the sandbox preview indicate issues with the sandbox setup.

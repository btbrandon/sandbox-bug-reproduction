# Sandbox Project - Bug Demonstration

This Next.js project demonstrates a Tailwind CSS styling bug that occurs when the same MapLibre GL JS code is executed through a dynamic sandbox server instead of running directly. The project includes both a Next.js frontend and a custom Vite-based sandbox server.

## Purpose

This project reveals styling inconsistencies between:

- **Direct execution** (as shown in `1-direct-project/`)
- **Sandboxed execution** (through the Vite-based sandbox server)

The sandbox server dynamically creates Vite instances that serve the same code as the direct project, but with different Tailwind CSS processing results.

## Architecture

```
2-sandbox-project/
├── app/                    # Next.js frontend application
├── sandbox-server/         # Express + Vite sandbox server
├── base-files.js          # Shared code files for sandbox
└── package.json           # Next.js project dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
cd sandbox-server && npm install && cd ..
```

### 2. Start the Next.js Frontend

```bash
npm run dev
```

This starts the Next.js app on http://localhost:3000

### 3. Start the Sandbox Server

In a **separate terminal**:

```bash
npm run sandbox:dev
```

This starts the sandbox server on http://localhost:4000

### 4. View the Bug

1. Open http://localhost:3000 in your browser
2. You'll see a Next.js page with an iframe
3. **The iframe will show a severely broken version** with:
   - Black/empty screen where the map should be
   - Unstyled text instead of the layer panel
   - No Tailwind CSS styling applied
   - Missing components and functionality
4. Compare this broken output with the fully functional direct project version

## 🐛 **Bug Summary**

This demonstrates a **Tailwind CSS configuration failure** in sandbox environments where:

- The same `base-files.js` produces a complete, styled application in the direct project
- But results in unstyled, broken-looking components in the sandbox due to Tailwind content configuration issues
- Shows how Tailwind CSS content scanning can fail in dynamic build contexts
- Highlights the critical importance of proper content path configuration in different deployment scenarios

**Key Issue**: Tailwind CSS content configuration warnings indicate the build system cannot properly scan for CSS classes in the sandbox environment.

## What You'll Observe

### Expected Behavior (Direct Project)

- **Complete UI**: Layer panel (left), header panel (right), interactive map
- **Layer Panel**: Semi-transparent panel with checkboxes for Tallest Towers, Largest Waterfalls, 7 Wonders
- **Interactive Map**: Full MapLibre GL JS map with colored markers across the globe
- **Proper Styling**: Tailwind CSS classes applied correctly with backdrop blur effects
- **Full Functionality**: Layer toggles, marker popups, responsive design

### **Critical Bug Behavior (Sandbox Server)**

- **🚨 TAILWIND CONFIG MISSING**: Console shows Tailwind content configuration warnings
- **🚨 UNSTYLED COMPONENTS**: Map and panels render but without any styling
- **🚨 CSS GENERATION FAILURE**: Tailwind CSS not scanning files properly in sandbox context
- **🚨 BROKEN LAYOUT**: Components appear as unstyled HTML without positioning or visual hierarchy

**Console Warnings Observed:**

```
warn - The `content` option in your Tailwind CSS configuration is missing or empty.
warn - Configure your content sources or your generated CSS will be missing styles.
```

### Root Cause Analysis

The sandbox server has a **Tailwind CSS content configuration issue**, evidenced by these console warnings:

```
warn - The `content` option in your Tailwind CSS configuration is missing or empty.
warn - Configure your content sources or your generated CSS will be missing styles.
warn - https://tailwindcss.com/docs/content-configuration
```

**Technical Details:**

- **Map Component Present**: The MapLibre GL JS component is actually loaded and functional
- **Styling Missing**: Tailwind CSS classes are not being generated due to content configuration issues
- **Template Mismatch**: Sandbox server's Tailwind config doesn't properly scan for CSS classes
- **Build Context Differences**: Vite's Tailwind CSS processing differs between direct and sandbox environments
- **CSS Generation Failure**: Without proper content scanning, Tailwind generates empty/minimal CSS

## Sandbox Server Details

The sandbox server (`sandbox-server/server.js`) creates dynamic Vite instances that:

- Serve the same source code as the direct project
- Process Tailwind CSS in a different build context
- Use temporary directories for each sandbox instance
- May have different CSS optimization behaviors

## Technology Stack

- **Next.js 15**: Frontend framework with Turbopack
- **Express**: Sandbox server backend
- **Vite**: Dynamic build tool for sandbox instances
- **MapLibre GL JS**: Map rendering (same as direct project)
- **Tailwind CSS**: Styling framework (processing differs)

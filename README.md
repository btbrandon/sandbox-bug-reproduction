# Bug Reproduction Repository

This repository demonstrates a Tailwind CSS styling issue when code is executed in a sandboxed environment versus running directly in an IDE.
## Repository Structure

```
bug-reproduction/
├── 1-direct-project/          # Direct Remix project (works correctly)
├── 2-sandbox-project/         # Next.js wrapper with sandbox server (shows bug)
└── README.md                  # This file
```

## Issue Description

When the same MapLibre GL JS code with Tailwind CSS styling is:

- **Run directly** in `1-direct-project/`: Map markers display correctly, Map renders correctly
- **Run through sandbox server** in `2-sandbox-project/`: Map markers have styling/positioning issues, Map does not render

This demonstrates a potential conflict between Tailwind CSS processing and sandbox environments.

## Quick Start

### Option 1: Run Direct Project (Expected Behavior)

```bash
cd 1-direct-project
npm install
npm run dev
```

Open http://localhost:5173 to see the correctly styled map markers.

### Option 2: Run Sandbox Project (Bug Demonstration)

```bash
cd 2-sandbox-project
npm install
npm run dev
```

Then in a separate terminal:

```bash
cd 2-sandbox-project
npm run sandbox:dev
```

Open http://localhost:3000 to see the Next.js app with an iframe showing the sandboxed version with styling issues.

## Bug Analysis

The sandbox server in `2-sandbox-project/sandbox-server/` creates dynamic Vite instances that serve the same code as `1-direct-project/`, but the Tailwind CSS processing appears to be affected by the sandboxed environment, leading to:

- Missing or malformed styles
- Potential CSS class conflicts

## Technologies Used

- **MapLibre GL JS**: Interactive map rendering
- **Tailwind CSS**: Utility-first CSS framework
- **Remix**: Full-stack web framework (direct project)
- **Next.js**: React framework (sandbox wrapper)
- **Vite**: Build tool and dev server
- **Express**: Sandbox server backend

## Investigation Notes

This bug reproduction is designed to help identify:

1. How Tailwind CSS processing differs between direct and sandboxed environments
2. Whether the issue is related to CSS build processes, class name generation, or runtime styling
3. Potential solutions for maintaining consistent styling across different execution environments

## Getting Started

See the individual README files in each subfolder for detailed setup instructions:

- [Direct Project Setup](./1-direct-project/README.md)
- [Sandbox Project Setup](./2-sandbox-project/README.md)

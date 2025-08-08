# Bug Reproduction Repository

This repository demonstrates Vite createServer issues with Remix projects in different environments.

## Repository Structure

```
bug-reproduction/
├── 1-direct-project/          # Direct Remix project (reference implementation)
├── 2-server-project/          # Standalone Node.js server reproduction
└── README.md                  # This file
```

## Issue Description

This repository contains different approaches to reproduce Vite createServer issues:

- **Direct project** in `1-direct-project/`: Standard Remix project setup
- **Server reproduction** in `2-server-project/`: Minimal Node.js script that uses Vite's createServer API

## Quick Start

### Option 1: Run Direct Project (Reference)

```bash
cd 1-direct-project
npm install
npm run dev
```

Open http://localhost:5173 to see the standard Remix application.

### Option 2: Run Server Reproduction (Bug Investigation)

```bash
cd 2-server-project
npm install
node index.js
```

Open http://localhost:5173 to see the Vite createServer reproduction.

## Server Project Features

The `2-server-project` includes optimizations:

- **Template caching**: First run creates template with dependencies
- **Fast copying**: Subsequent runs copy from template (~5 seconds vs ~2 minutes)
- **Proper config**: Uses `vite.config.ts` with Remix plugins
- **Error reproduction**: Minimal environment to isolate Vite issues

## Technologies Used

- **MapLibre GL JS**: Interactive map rendering
- **Tailwind CSS**: Utility-first CSS framework
- **Remix**: Full-stack web framework
- **Vite**: Build tool and dev server with createServer API
- **Node.js**: Server runtime for reproduction script

## Investigation Notes

This bug reproduction is designed to help identify:

1. How Vite's createServer API behaves with Remix projects
2. Configuration issues between direct Vite usage and Remix integration
3. Entry point resolution problems (e.g., entry.client.tsx errors)
4. Plugin loading and transformation pipeline issues

## Getting Started

See the individual README files in each subfolder for detailed setup instructions:

- [Direct Project Setup](./1-direct-project/README.md)
- [Server Project Setup](./2-server-project/README.md)

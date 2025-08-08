# Vite Bug Reproduction

A minimal Node.js project to reproduce Vite createServer issues with Remix projects.

## What it does

This script:

1. **First run**: Creates a template directory with pre-installed dependencies (slow, ~1-2 minutes)
2. **Subsequent runs**: Copies from template and starts server instantly (fast, ~5 seconds)
3. Uses Vite's `createServer` API with proper Remix configuration
4. Serves the Remix application at http://localhost:5173

## Performance Optimization

- **Template caching**: Dependencies are installed once in a template directory
- **Fast copying**: Subsequent runs copy the entire project from template instead of reinstalling 926 packages
- **Silent npm**: Uses `--silent --no-audit --no-fund` flags for faster installs

## Usage

```bash
cd 2-server-project
npm install
node index.js
```

## Structure

- `index.js` - Main script that creates the temp project and starts Vite server
- `base-files.js` - Remix project template files (imported from parent directory)
- `package.json` - Dependencies for the reproduction script (vite, fs-extra)
- `template/` - Auto-generated template with pre-installed dependencies (created on first run)
- `temp-project/` - Auto-generated Remix project (created/copied at runtime)

## Template System

The script uses a smart template system:

1. **First run**:

   - Creates `template/` directory
   - Writes all Remix files
   - Runs `npm install` once (slow)
   - Copies template to `temp-project/`
   - Starts Vite server

2. **Subsequent runs**:
   - Copies from existing `template/` directory (fast)
   - Skips dependency installation
   - Starts Vite server immediately

## Purpose

This is a simplified version of the original sandbox server system, designed to reproduce Vite createServer bugs in a minimal environment without Next.js interference.

## Troubleshooting

- **First run slow**: This is expected as it installs 926 packages for the template
- **Subsequent runs fast**: Should start in ~5 seconds by copying from template
- **Clear template**: Delete `template/` directory to force reinstallation
- **Port conflicts**: Script uses `strictPort: false` to find available port
- **First render errors**: Sometimes the initial page load may show errors - **refresh the browser** to resolve this issue

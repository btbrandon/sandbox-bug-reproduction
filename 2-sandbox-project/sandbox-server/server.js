import express from "express";
import fs from "fs-extra";
import path from "path";
import cors from "cors";
import crypto from "crypto";
import { createServer } from "vite";
import { baseFiles } from "../base-files.js";

const app = express();
app.use(cors());
app.use(express.json());

// Base directory for sandboxes
const ROOT_DIR = "/private/tmp/vite-sandboxes";
const TEMPLATE_DIR = "/private/tmp/vite-sandboxes/.template";
const PORT = 4000;

// Track the previous Vite server instance
let previousViteServer = null;

// Track active sandboxes by ID
const activeSandboxes = new Map(); // sandboxId -> { projectPath, viteServer, port, chatId }

// Track sandboxes by chatId for quick lookup
const sandboxesByChat = new Map(); // chatId -> sandboxId

// Initialize template directory with pre-installed dependencies
async function initializeTemplate() {
  try {
    const templateExists = await fs.pathExists(TEMPLATE_DIR);
    if (!templateExists) {
      console.log(
        "[sandbox] Creating template directory with pre-installed dependencies..."
      );
      await fs.ensureDir(TEMPLATE_DIR);

      // Write base files to template
      for (const baseFile of baseFiles) {
        const fullPath = path.join(TEMPLATE_DIR, baseFile.path);
        await fs.ensureFile(fullPath);
        await fs.writeFile(fullPath, baseFile.content);
      }

      // Install dependencies in template
      await installDependencies(TEMPLATE_DIR);
      console.log("[sandbox] ✓ Template directory initialized");
    } else {
      console.log("[sandbox] Template directory already exists");
    }
  } catch (error) {
    console.error("[sandbox] Failed to initialize template:", error);
    // Continue without template - fallback to regular npm install
  }
}

// Copy template to new sandbox directory
async function copyFromTemplate(targetPath) {
  try {
    const templateExists = await fs.pathExists(TEMPLATE_DIR);
    if (templateExists) {
      console.log(`[sandbox] Copying from template to ${targetPath}...`);
      await fs.copy(TEMPLATE_DIR, targetPath);
      return true;
    }
  } catch (error) {
    console.error("[sandbox] Failed to copy from template:", error);
  }
  return false;
}

// Function to install dependencies in a project directory
async function installDependencies(projectPath) {
  return new Promise(async (resolve, reject) => {
    const { spawn } = await import("child_process");

    console.log(`[sandbox] Running npm install in ${projectPath}...`);

    // Use faster npm install options
    const npmArgs = [
      "install",
      "--silent",
      "--no-audit",
      "--no-fund",
      "--prefer-offline",
      "--no-package-lock",
    ];

    const npmProcess = spawn("npm", npmArgs, {
      cwd: projectPath,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let output = "";
    let errorOutput = "";
    let lastProgressTime = Date.now();

    npmProcess.stdout.on("data", (data) => {
      output += data.toString();
      // Log progress every 10 seconds
      const now = Date.now();
      if (now - lastProgressTime > 10000) {
        console.log(`[sandbox] npm install still running...`);
        lastProgressTime = now;
      }
    });

    npmProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    npmProcess.on("close", (code) => {
      if (code === 0) {
        console.log(`[sandbox] ✓ Dependencies installed successfully`);
        resolve();
      } else {
        console.error(`[sandbox] ❌ npm install failed with code ${code}`);
        console.error(`[sandbox] Error output: ${errorOutput}`);
        reject(new Error(`npm install failed: ${errorOutput}`));
      }
    });

    npmProcess.on("error", (error) => {
      console.error(`[sandbox] ❌ Failed to start npm install:`, error);
      reject(error);
    });

    // Increase timeout to 3 minutes
    const timeout = setTimeout(() => {
      console.log(`[sandbox] ❌ npm install timeout after 3 minutes`);
      npmProcess.kill("SIGKILL");
      reject(new Error("npm install timeout"));
    }, 180000); // 3 minutes

    // Clear timeout if process completes
    npmProcess.on("close", () => {
      clearTimeout(timeout);
    });
  });
}

app.post("/start", async (req, res) => {
  console.log("[sandbox] Received POST /start request");
  try {
    const { files, chatId } = req.body;
    if (!files || typeof files !== "object") {
      return res.status(400).json({ error: "Invalid files input" });
    }

    // Check if we already have a sandbox for this chat ID using efficient lookup
    if (chatId && sandboxesByChat.has(chatId)) {
      const existingSandboxId = sandboxesByChat.get(chatId);
      const sandbox = activeSandboxes.get(existingSandboxId);

      if (sandbox) {
        console.log(
          `[sandbox] Found existing sandbox for chat ${chatId}: ${existingSandboxId}`
        );
        console.log(`[sandbox] Updating files instead of creating new sandbox`);

        // Update files in existing sandbox
        console.log(`[sandbox] Files to update:`, Object.keys(files));
        for (const [filePath, content] of Object.entries(files)) {
          const cleanPath = filePath.startsWith("/")
            ? filePath.slice(1)
            : filePath;
          const fullPath = path.join(sandbox.projectPath, cleanPath);
          await fs.ensureFile(fullPath);
          await fs.writeFile(fullPath, content);
          console.log(`[sandbox] Updated file: ${cleanPath}`);
        }

        const sandboxUrl = `http://localhost:${sandbox.port}/`;
        console.log(
          `[sandbox] ✅ Files updated in existing sandbox: ${sandboxUrl}`
        );
        return res.json({ sandboxUrl, sandboxId: existingSandboxId });
      } else {
        // Sandbox ID exists but sandbox is gone, clean up the mapping
        console.log(`[sandbox] Cleaning up stale mapping for chat ${chatId}`);
        sandboxesByChat.delete(chatId);
      }
    }

    // If a previous Vite server exists, close it before starting a new one
    if (previousViteServer) {
      try {
        await previousViteServer.close();
        previousViteServer = null;
        console.log("[sandbox] Previous Vite server closed");
      } catch (closeErr) {
        console.error(
          "[sandbox] Error closing previous Vite server:",
          closeErr
        );
      }
    }

    // Create a unique sandbox directory
    const sandboxId = crypto.randomUUID();
    const projectPath = path.join(ROOT_DIR, sandboxId);
    await fs.ensureDir(projectPath);

    console.log(`[sandbox] Creating project in: ${projectPath}`);
    console.log(`[sandbox] User files to write:`, Object.keys(files));

    // Try to copy from template first, fallback to writing base files
    const copiedFromTemplate = await copyFromTemplate(projectPath);

    if (!copiedFromTemplate) {
      // Fallback: write base files manually
      console.log(`[sandbox] Writing base files...`);
      for (const baseFile of baseFiles) {
        const fullPath = path.join(projectPath, baseFile.path);
        await fs.ensureFile(fullPath);
        await fs.writeFile(fullPath, baseFile.content);
      }
    }

    // Then, write user files (these may override base files)
    console.log(`[sandbox] Writing user files...`);
    for (const [filePath, content] of Object.entries(files)) {
      // Remove leading slash if present
      const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
      const fullPath = path.join(projectPath, cleanPath);
      await fs.ensureFile(fullPath);
      await fs.writeFile(fullPath, content);
      console.log(`[sandbox] Written user file: ${cleanPath}`);
    }

    // Install dependencies only if we didn't copy from template
    if (!copiedFromTemplate) {
      console.log(`[sandbox] Installing dependencies...`);
      await installDependencies(projectPath);
    } else {
      console.log(`[sandbox] ✓ Using pre-installed dependencies from template`);
    }

    // Choose a port for Vite dev server
    const port = 5173 + Math.floor(Math.random() * 1000);

    console.log(`[sandbox] Starting Vite server on port ${port}...`);
    console.log(`[sandbox] Project path: ${projectPath}`);

    const viteServer = await createServer({
      root: projectPath,
      mode: "development",
      // define: {
      //   "process.env.NODE_ENV": "development",
      // },
      configFile: path.join(projectPath, "vite.config.ts"),
      server: {
        port,
        strictPort: true,
        hmr: { clientPort: port },
        watch: {
          // Ensure CSS files are watched for changes
          ignored: ["!**/app/**/*.css"],
        },
      },
      build: {
        cssCodeSplit: false,
      },
      optimizeDeps: {
        include: ["tailwindcss", "autoprefixer"],
      },
    });

    await viteServer.listen();

    console.log(`[sandbox] ✓ Vite server started successfully`);
    viteServer.printUrls();

    // Store the current Vite server instance for future cleanup
    previousViteServer = viteServer;

    // Track this sandbox
    activeSandboxes.set(sandboxId, {
      projectPath,
      viteServer,
      port,
      chatId,
    });

    // Map chatId to sandboxId for future lookups
    if (chatId) {
      sandboxesByChat.set(chatId, sandboxId);
      console.log(`[sandbox] 📋 Mapped chat ${chatId} to sandbox ${sandboxId}`);
    }

    const sandboxUrl = `http://localhost:${port}/`;
    console.log(`[sandbox] 🚀 Sandbox available at: ${sandboxUrl}`);
    console.log(
      `[sandbox] 📝 Sandbox ID: ${sandboxId}${
        chatId ? `, Chat ID: ${chatId}` : ""
      }`
    );

    return res.json({ sandboxUrl, sandboxId });
  } catch (err) {
    console.error("[sandbox] Vite startup error:", err);
    return res
      .status(500)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// Create sandbox with default base files
app.post("/sandboxes", async (req, res) => {
  console.log("[sandbox] Received POST /sandboxes request");
  try {
    const { chatId } = req.body;

    // Check if we already have a sandbox for this chat ID using efficient lookup
    if (chatId && sandboxesByChat.has(chatId)) {
      const existingSandboxId = sandboxesByChat.get(chatId);
      const sandbox = activeSandboxes.get(existingSandboxId);

      if (sandbox) {
        console.log(
          `[sandbox] Found existing sandbox for chat ${chatId}: ${existingSandboxId}`
        );
        const sandboxUrl = `http://localhost:${sandbox.port}/`;
        return res.json({
          sandboxUrl,
          sandboxId: existingSandboxId,
          message: "Using existing sandbox",
        });
      } else {
        // Sandbox ID exists but sandbox is gone, clean up the mapping
        console.log(`[sandbox] Cleaning up stale mapping for chat ${chatId}`);
        sandboxesByChat.delete(chatId);
      }
    }

    // If a previous Vite server exists, close it before starting a new one
    if (previousViteServer) {
      try {
        await previousViteServer.close();
        previousViteServer = null;
        console.log("[sandbox] Previous Vite server closed");
      } catch (closeErr) {
        console.error(
          "[sandbox] Error closing previous Vite server:",
          closeErr
        );
      }
    }

    // Create a unique sandbox directory
    const sandboxId = crypto.randomUUID();
    const projectPath = path.join(ROOT_DIR, sandboxId);
    await fs.ensureDir(projectPath);

    console.log(`[sandbox] Creating project in: ${projectPath}`);
    console.log(`[sandbox] Using base files for new sandbox`);

    // Try to copy from template first, fallback to writing base files
    const copiedFromTemplate = await copyFromTemplate(projectPath);

    if (!copiedFromTemplate) {
      // Fallback: write base files manually
      console.log(`[sandbox] Writing base files...`);
      for (const baseFile of baseFiles) {
        const fullPath = path.join(projectPath, baseFile.path);
        await fs.ensureFile(fullPath);
        await fs.writeFile(fullPath, baseFile.content);
      }
    }

    // Install dependencies only if we didn't copy from template
    if (!copiedFromTemplate) {
      console.log(`[sandbox] Installing dependencies...`);
      await installDependencies(projectPath);
    } else {
      console.log(`[sandbox] ✓ Using pre-installed dependencies from template`);
    }

    // Choose a port for Vite dev server
    const port = 5173 + Math.floor(Math.random() * 1000);

    console.log(`[sandbox] Starting Vite server on port ${port}...`);
    console.log(`[sandbox] Project path: ${projectPath}`);

    const viteServer = await createServer({
      root: projectPath,
      mode: "development",
      configFile: path.join(projectPath, "vite.config.ts"),
      server: {
        port,
        strictPort: true,
        hmr: { clientPort: port },
        watch: {
          // Ensure CSS files are watched for changes
          ignored: ["!**/app/**/*.css"],
        },
      },
      build: {
        cssCodeSplit: false,
      },
      optimizeDeps: {
        include: ["tailwindcss", "autoprefixer"],
      },
    });

    await viteServer.listen();

    console.log(`[sandbox] ✓ Vite server started successfully`);
    viteServer.printUrls();

    // Store the current Vite server instance for future cleanup
    previousViteServer = viteServer;

    // Track this sandbox
    activeSandboxes.set(sandboxId, {
      projectPath,
      viteServer,
      port,
      chatId,
    });

    // Map chatId to sandboxId for future lookups
    if (chatId) {
      sandboxesByChat.set(chatId, sandboxId);
      console.log(`[sandbox] 📋 Mapped chat ${chatId} to sandbox ${sandboxId}`);
    }

    const sandboxUrl = `http://localhost:${port}/`;
    console.log(`[sandbox] 🚀 Sandbox available at: ${sandboxUrl}`);
    console.log(
      `[sandbox] 📝 Sandbox ID: ${sandboxId}${
        chatId ? `, Chat ID: ${chatId}` : ""
      }`
    );

    return res.json({ sandboxUrl, sandboxId });
  } catch (err) {
    console.error("[sandbox] Vite startup error:", err);
    return res
      .status(500)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
});

app.put("/sandboxes/:id/file", async (req, res) => {
  const { id } = req.params;
  const { path: relPath, content } = req.body;
  if (!relPath || typeof content !== "string") {
    return res.status(400).json({ error: "path and content required" });
  }

  const sandbox = activeSandboxes.get(id);
  if (!sandbox) {
    return res.status(404).json({ error: "Sandbox not found" });
  }

  const fullPath = path.join(sandbox.projectPath, relPath.replace(/^\/+/, ""));
  await fs.ensureFile(fullPath);
  await fs.writeFile(fullPath, content);

  console.log(`[sandbox] Updated file ${relPath} in sandbox ${id}`);
  res.json({ ok: true });
});

// Clean up a specific sandbox
app.delete("/sandboxes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sandbox = activeSandboxes.get(id);
    if (!sandbox) {
      return res.status(404).json({ error: "Sandbox not found" });
    }

    // Close Vite server
    if (sandbox.viteServer && typeof sandbox.viteServer.close === "function") {
      await sandbox.viteServer.close();
      console.log(`[sandbox] Closed Vite server for sandbox ${id}`);
    }

    // Remove from active sandboxes
    activeSandboxes.delete(id);

    // Remove from chat mapping if exists
    if (sandbox.chatId && sandboxesByChat.get(sandbox.chatId) === id) {
      sandboxesByChat.delete(sandbox.chatId);
      console.log(`[sandbox] Removed chat mapping for ${sandbox.chatId}`);
    }

    // Optionally clean up files (commented out for safety)
    // await fs.remove(sandbox.projectPath);

    console.log(`[sandbox] ✅ Cleaned up sandbox ${id}`);
    res.json({ success: true });
  } catch (error) {
    console.error(`[sandbox] Error cleaning up sandbox ${id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Check if a sandbox exists for a chat
app.get("/sandbox/:chatId", (req, res) => {
  const { chatId } = req.params;

  console.log(`[sandbox] Checking sandbox for chat: ${chatId}`);
  const sandboxId = sandboxesByChat.get(chatId);
  const sandbox = sandboxId ? activeSandboxes.get(sandboxId) : null;

  if (sandbox) {
    console.log(`[sandbox] Found sandbox ${sandboxId} for chat ${chatId}`);
    res.json({
      exists: true,
      sandboxId,
      sandboxUrl: sandbox.viteServer
        ? `http://localhost:${sandbox.port}`
        : null,
      chatId: sandbox.chatId,
    });
  } else {
    console.log(`[sandbox] No sandbox found for chat ${chatId}`);
    res.json({ exists: false });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Graceful shutdown
async function cleanup() {
  console.log("[sandbox] Shutting down all sandboxes...");

  for (const [sandboxId, sandbox] of activeSandboxes) {
    try {
      if (
        sandbox.viteServer &&
        typeof sandbox.viteServer.close === "function"
      ) {
        await sandbox.viteServer.close();
        console.log(`[sandbox] Closed Vite server for sandbox ${sandboxId}`);
      }
    } catch (error) {
      console.error(`[sandbox] Error closing sandbox ${sandboxId}:`, error);
    }
  }

  activeSandboxes.clear();
  sandboxesByChat.clear();
  console.log("[sandbox] ✅ Cleanup complete");
  process.exit(0);
}

// Handle graceful shutdown
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Initialize template directory on startup
initializeTemplate()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🏗️  Sandbox runner listening on http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error(
      "[sandbox] Failed to initialize template, starting anyway:",
      error
    );
    app.listen(PORT, () =>
      console.log(`🏗️  Sandbox runner listening on http://localhost:${PORT}`)
    );
  });

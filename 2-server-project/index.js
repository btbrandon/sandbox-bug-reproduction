import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { baseFiles } from "./base-files.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_DIR = path.join(__dirname, "temp-project");
const PORT = 5173;

async function setupProject() {
  console.log("🚀 Setting up temporary Remix project...");

  if (await fs.pathExists(PROJECT_DIR)) {
    await fs.remove(PROJECT_DIR);
  }

  await fs.ensureDir(PROJECT_DIR);

  for (const file of baseFiles) {
    const filePath = path.join(PROJECT_DIR, file.path);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, file.content);
  }

  console.log("✅ Project files created");
}

async function installDependencies() {
  console.log("📦 Installing dependencies...");

  const { spawn } = await import("child_process");

  return new Promise((resolve, reject) => {
    const npm = spawn("npm", ["install"], {
      cwd: PROJECT_DIR,
      stdio: "inherit",
    });

    npm.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Dependencies installed");
        resolve();
      } else {
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
  });
}

async function startViteServer() {
  console.log("🔥 Starting Vite development server...");

  try {
    const viteModulePath = path.join(
      PROJECT_DIR,
      "node_modules",
      "vite",
      "dist",
      "node",
      "index.js"
    );
    const { createServer } = await import(viteModulePath);

    console.log(`Creating Vite server for ${PROJECT_DIR}...`);

    const server = await createServer({
      root: PROJECT_DIR,
      mode: "development",
      configFile: path.join(PROJECT_DIR, "vite.config.ts"),
      server: {
        port: PORT,
        strictPort: false,
        host: true,
      },
    });

    await server.listen();

    console.log("\n🎉 Vite server started successfully!");
    console.log(
      `\n  ➜  Local:   http://localhost:${server.config.server.port || PORT}`
    );
    console.log(`  ➜  Network: use --host to expose\n`);

    // Keep the server running
    process.on("SIGINT", async () => {
      console.log("\n👋 Shutting down server...");
      await server.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("\n👋 Shutting down server...");
      await server.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Failed to start Vite server:", error);
    process.exit(1);
  }
}

async function main() {
  try {
    await setupProject();
    await installDependencies();
    await startViteServer();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();

import { createServer } from "vite";
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

  // Clean up any existing project
  if (await fs.pathExists(PROJECT_DIR)) {
    await fs.remove(PROJECT_DIR);
  }

  // Create project directory
  await fs.ensureDir(PROJECT_DIR);

  // Write all base files
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
    const server = await createServer({
      root: PROJECT_DIR,
      mode: "development",
      // define: {
      //   "process.env.NODE_ENV": "development",
      // },
      configFile: path.join(PROJECT_DIR, "vite.config.ts"),
      server: {
        PORT,
        strictPort: true,
        hmr: { clientPort: PORT },
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

    await server.listen();

    const info = server.config.logger.info;

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

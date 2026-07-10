import express from "express";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { createServer as createViteServer } from "vite";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Serve the student's task management app statically at /app
  app.use("/app", express.static(path.join(process.cwd(), "frontend-testing", "src")));

  // API 1: Run Jest tests and return results
  app.post("/api/run-tests", (req, res) => {
    // We execute jest with output parameters to capture results
    const cmd = "npx jest --config=frontend-testing/jest.config.js --coverage --json --outputFile=frontend-testing/test-results.json";
    
    exec(cmd, (error, stdout, stderr) => {
      // Note: Jest returns exit code 1 if tests fail, so we should read files even if error is true
      const resultsPath = path.join(process.cwd(), "frontend-testing", "test-results.json");
      const coveragePath = path.join(process.cwd(), "frontend-testing", "coverage", "coverage-summary.json");
      
      let testResults = null;
      let coverageSummary = null;
      
      try {
        if (fs.existsSync(resultsPath)) {
          testResults = JSON.parse(fs.readFileSync(resultsPath, "utf-8"));
        }
      } catch (e) {
        console.error("Failed to parse test results JSON:", e);
      }
      
      try {
        if (fs.existsSync(coveragePath)) {
          coverageSummary = JSON.parse(fs.readFileSync(coveragePath, "utf-8"));
        }
      } catch (e) {
        console.error("Failed to parse coverage summary JSON:", e);
      }
      
      res.json({
        success: !error || (testResults && testResults.success),
        stdout: stdout || "",
        stderr: stderr || "",
        testResults,
        coverageSummary
      });
    });
  });

  // API 2: Fetch all project files for the interactive explorer
  app.get("/api/files", (req, res) => {
    const rootDir = path.join(process.cwd(), "frontend-testing");
    const filesToRead = [
      "package.json",
      "jest.config.js",
      "babel.config.js",
      ".gitignore",
      "README.md",
      "src/index.html",
      "src/style.css",
      "src/app.js",
      "src/taskManager.js",
      "src/storage.js",
      "src/validation.js",
      "src/utils.js",
      "tests/taskManager.test.js",
      "tests/validation.test.js",
      "tests/storage.test.js",
      "tests/utils.test.js"
    ];
    
    const fileContents: Record<string, string> = {};
    
    for (const relativePath of filesToRead) {
      const fullPath = path.join(rootDir, relativePath);
      if (fs.existsSync(fullPath)) {
        fileContents[relativePath] = fs.readFileSync(fullPath, "utf-8");
      }
    }
    
    res.json({ files: fileContents });
  });

  // API 3: Update a specific file (to allow live edits of code & tests!)
  app.post("/api/files", (req, res) => {
    const { filePath, content } = req.body;
    if (!filePath || typeof content !== "string") {
      return res.status(400).json({ error: "Invalid parameters" });
    }
    
    // Safety check to prevent writing outside the frontend-testing folder
    const normalizedPath = path.normalize(filePath);
    if (normalizedPath.startsWith("..") || path.isAbsolute(normalizedPath)) {
      return res.status(400).json({ error: "Access denied" });
    }
    
    const fullPath = path.join(process.cwd(), "frontend-testing", normalizedPath);
    try {
      fs.writeFileSync(fullPath, content, "utf-8");
      res.json({ success: true, message: `File ${filePath} updated successfully.` });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Serve React Front End (Vite in Dev, static build in Prod)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support single-page application routing
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

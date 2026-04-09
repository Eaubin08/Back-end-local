import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

// __filename and __dirname are not used

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/explorer", (req, res) => {
    const rootDir = process.cwd();
    
    interface FileNode {
      name: string;
      path: string;
      type: "directory" | "file";
      children?: FileNode[];
    }

    const getFiles = (dir: string): FileNode[] => {
      const items = fs.readdirSync(dir);
      return items
        .filter(item => !item.startsWith('.') && item !== 'node_modules' && item !== 'dist')
        .map((item) => {
          const fullPath = path.join(dir, item);
          const relativePath = path.relative(rootDir, fullPath);
          const stats = fs.statSync(fullPath);
          if (stats.isDirectory()) {
            return {
              name: item,
              path: relativePath,
              type: "directory",
              children: getFiles(fullPath),
            };
          }
          return {
            name: item,
            path: relativePath,
            type: "file",
          };
        });
    };

    res.json(getFiles(rootDir));
  });

  app.get("/api/system", (req, res) => {
    // Mock system tree
    const systemTree = [
      {
        name: "OS0 KERNEL",
        path: "system/os0_kernel",
        type: "directory",
        children: [
          { name: "core.sys", path: "system/os0_kernel/core.sys", type: "file" },
          { name: "memory.sys", path: "system/os0_kernel/memory.sys", type: "file" },
        ],
      },
      {
        name: "OS1 REFLEX",
        path: "system/os1_reflex",
        type: "directory",
        children: [
          { name: "signal.sys", path: "system/os1_reflex/signal.sys", type: "file" },
          { name: "response.sys", path: "system/os1_reflex/response.sys", type: "file" },
        ],
      },
      {
        name: "OS2 QUANTUM",
        path: "system/os2_quantum",
        type: "directory",
        children: [
          { name: "entanglement.sys", path: "system/os2_quantum/entanglement.sys", type: "file" },
          { name: "superposition.sys", path: "system/os2_quantum/superposition.sys", type: "file" },
        ],
      },
      {
        name: "OS3 WORLD",
        path: "system/os3_world",
        type: "directory",
        children: [
          { name: "physics.sys", path: "system/os3_world/physics.sys", type: "file" },
          { name: "interaction.sys", path: "system/os3_world/interaction.sys", type: "file" },
        ],
      },
      {
        name: "OS4 PROOF",
        path: "system/os4_proof",
        type: "directory",
        children: [
          { name: "logic.sys", path: "system/os4_proof/logic.sys", type: "file" },
          { name: "verification.sys", path: "system/os4_proof/verification.sys", type: "file" },
        ],
      },
      {
        name: "OS5 FOUNDATIONS",
        path: "system/os5_foundations",
        type: "directory",
        children: [
          { name: "base.sys", path: "system/os5_foundations/base.sys", type: "file" },
          { name: "structure.sys", path: "system/os5_foundations/structure.sys", type: "file" },
        ],
      },
    ];
    res.json(systemTree);
  });

  app.get("/api/file", (req, res) => {
    const filePath = req.query.path as string;
    if (!filePath) {
      return res.status(400).json({ error: "Path is required" });
    }

    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
      return res.status(404).json({ error: "File not found" });
    }

    const content = fs.readFileSync(fullPath, "utf-8");
    res.json({ content });
  });

  app.get("/api/status", (req, res) => {
    res.json({
      kernel: "ACTIVE",
      reflex: "NOMINAL",
      quantum: "STABLE",
      world: "SYNCED",
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

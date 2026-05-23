const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const port = Number(process.env.CLIENT_PORT || 5173);
const distDir = path.join(__dirname, "dist");

const mimeTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  
  // Determine target file path
  let filePath;
  const isRoot = safePath === "/" || safePath === "\\" || safePath === "." || safePath === "";
  if (isRoot) {
    filePath = path.join(distDir, "index.html");
  } else {
    filePath = path.join(distDir, safePath);
  }

  let targetPath = path.join(distDir, "index.html");
  try {
    // Only serve if it exists, is a file, and is inside the distDir
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const relative = path.relative(distDir, filePath);
      const isInside = !relative.startsWith("..") && !path.isAbsolute(relative);
      if (isInside) {
        targetPath = filePath;
      }
    }
  } catch (e) {
    // Fallback to index.html
  }

  const extension = path.extname(targetPath);

  fs.readFile(targetPath, (error, content) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Client build not found. Run npm run build -w client first.");
      return;
    }

    res.writeHead(200, { "Content-Type": mimeTypes[extension] || "application/octet-stream" });
    res.end(content);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`React client running on http://localhost:${port}`);
});

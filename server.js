const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3030;
const publicDirectory = path.join(__dirname, "public");

const backendHost = "isa-c4p-ql4s.onrender.com";// Backend hostname


const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/doc")) {
    // Proxy requests for Swagger UI to the backend
    const options = {
      hostname: backendHost,
      port: 443, // HTTPS default port
      path: req.url, // Forward the full path
      method: req.method,
      headers: req.headers,
    };

    const proxy = https.request(options, (backendRes) => {
      res.writeHead(backendRes.statusCode, backendRes.headers);
      backendRes.pipe(res, { end: true });
    });

    proxy.on("error", (err) => {
      console.error("Error proxying request:", err.message);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error communicating with backend");
    });

    req.pipe(proxy, { end: true });
    return;
  }
  let filePath;
  if (req.url === "/") {
    filePath = path.join(publicDirectory, "index.html");
  } else if (req.url === "/main") {
    filePath = path.join(publicDirectory, "main.html");
  } else if (req.url === "/admin") {
    filePath = path.join(publicDirectory, "admin.html");
  } else if (req.url.startsWith("/reset")) {
    filePath = path.join(publicDirectory, "password-reset.html");
  } else {
    filePath = path.join(publicDirectory, req.url);
  }

  const extname = path.extname(filePath);
  let contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "application/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    default:
      contentType = "text/html";
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - File Not Found</h1>", "utf8");
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`, "utf8");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf8");
    }
  });
});

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

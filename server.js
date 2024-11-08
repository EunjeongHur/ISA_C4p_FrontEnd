const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3030;
const publicDirectory = path.join(__dirname, "public");

const server = http.createServer((req, res) => {
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

  console.log(
    `Request URL: ${req.url}, Serving file: ${filePath} with content type: ${contentType}`
  );

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

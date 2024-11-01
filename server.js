const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3030;
const publicDirectory = path.join(__dirname, "public");

const server = http.createServer((req, res) => {
  // Set the default file to index.html for the root URL
  let filePath =
    req.url === "/"
      ? path.join(publicDirectory, "index.html")
      : path.join(publicDirectory, req.url);

  // Determine the content type based on the file extension
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

  // Read and serve the requested file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // If file not found, serve a 404 error
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - File Not Found</h1>", "utf8");
      } else {
        // For any other server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`, "utf8");
      }
    } else {
      // Serve the file with the correct content type
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf8");
    }
  });
});

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

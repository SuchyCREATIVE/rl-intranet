// Plesk Node.js entry point for Next.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = parseInt(process.env.PORT || "3002", 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Next.js request handler error:", err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }
  }).listen(port, () => {
    console.log(`> Räderlogistik Intranet ready on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("Failed to start Next.js:", err);
  process.exit(1);
});

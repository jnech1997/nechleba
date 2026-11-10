require("dotenv").config();
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const apiRouter = require("./routes/api");

const app = express();
const distDir = path.join(__dirname, "portfolio", "dist", "portfolio");

// Heroku terminates TLS at its router; trust it so req.ip / req.secure are correct.
app.set("trust proxy", 1);
app.disable("x-powered-by");

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      return res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
    }
    next();
  });
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "https://www.googletagmanager.com"],
        // Angular and Material inject component styles at runtime.
        "style-src": ["'self'", "'unsafe-inline'"],
        // Pokemon artwork is loaded from external hosts.
        "img-src": ["'self'", "data:", "https:"],
        "connect-src": [
          "'self'",
          "https://www.googletagmanager.com",
          "https://*.google-analytics.com",
          "https://*.analytics.google.com",
        ],
        "font-src": ["'self'", "data:"],
        "media-src": ["'self'"],
      },
    },
  })
);
app.use(compression());
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

// Hashed build output can be cached forever; index.html must always revalidate.
app.use(
  express.static(distDir, {
    index: false,
    setHeaders(res, filePath) {
      if (/\.[0-9a-f]{16,}\.(js|css|woff2?|ttf|eot)$/.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else {
        res.setHeader("Cache-Control", "public, max-age=3600");
      }
    },
  })
);

app.use("/api", apiRouter);

// Unknown API routes return JSON 404 instead of the SPA.
app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

// SPA entry point.
app.get(/.*/, (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(distDir, "index.html"));
});

// Final error handler: Express 5 forwards rejected async handlers here.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed" || err.type === "entity.too.large") {
    return res.status(err.status || 400).json({ error: "Invalid request body" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;

const { rateLimit } = require("express-rate-limit");

const json = (message) => ({ error: message });

// Login / signup: slow down password guessing.
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: json("Too many attempts, please try again later."),
});

// Token refresh happens automatically, so allow more.
exports.refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: json("Too many requests, please try again later."),
});

// Contact form: protect the inbox from floods.
exports.contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: json("Too many messages, please try again later."),
});

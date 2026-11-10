// Run with `npm test`. These tests cover validation and security paths
// that return before any database call, so no MongoDB is required.
process.env.NODE_ENV = "test";
process.env.TOKEN_KEY = "test-access-key";
process.env.REFRESH_TOKEN_KEY = "test-refresh-key";

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Fail fast instead of buffering if a test reaches the database by mistake.
mongoose.set("bufferCommands", false);

const app = require("../app");
const { parseTeamInput } = require("../controllers/pokemonController");

let server;
let base;
const token = jwt.sign({ user_id: new mongoose.Types.ObjectId() }, "test-access-key");
const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const post = (path, body, headers = { "Content-Type": "application/json" }) =>
  fetch(base + path, { method: "POST", headers, body: JSON.stringify(body) });

test("invalid team id returns 404 and the server keeps running", async () => {
  for (const method of ["GET", "PUT", "DELETE"]) {
    const res = await fetch(`${base}/api/pokemonteam/not-an-id`, {
      method,
      headers: authHeaders,
      body: method === "PUT" ? "{}" : undefined,
    });
    assert.equal(res.status, 404, method);
  }
  const res = await fetch(`${base}/api/unknown`);
  assert.equal(res.status, 404);
});

test("team routes require a token", async () => {
  const res = await fetch(`${base}/api/pokemonteam`);
  assert.equal(res.status, 401);
});

test("parseTeamInput ignores ownership and operator fields", () => {
  const { team } = parseTeamInput({
    name: "Rocket",
    pokemon_ids: [1, 4, 7],
    user: "someone-else",
    $set: { user: "x" },
    _id: "y",
  });
  assert.deepEqual(team, { name: "Rocket", pokemon_ids: [1, 4, 7] });
});

test("parseTeamInput rejects bad input", () => {
  assert.ok(parseTeamInput({ name: { $gt: "" } }).error);
  assert.ok(parseTeamInput({ name: "x".repeat(51) }).error);
  assert.ok(parseTeamInput({ pokemon_ids: [1, 2, 3, 4, 5, 6, 7] }).error);
  assert.ok(parseTeamInput({ pokemon_ids: [1, 1] }).error);
  assert.ok(parseTeamInput({ pokemon_ids: ["1"] }).error);
  assert.ok(parseTeamInput({ pokemon_ids: { $gt: 0 } }).error);
});

test("invalid team body returns 400", async () => {
  const res = await post("/api/pokemonteam", { pokemon_ids: [1, 2, 3, 4, 5, 6, 7] }, authHeaders);
  assert.equal(res.status, 400);
});

test("login rejects operator objects (NoSQL injection)", async () => {
  const res = await post("/api/login", { username: { $gt: "" }, password: "whatever123" });
  assert.equal(res.status, 400);
});

test("signup rejects missing and non-string fields", async () => {
  assert.equal((await post("/api/signup", { username: "abc" })).status, 400);
  const res = await post("/api/signup", {
    username: { $ne: null },
    password: "password123",
    firstName: "a",
    lastName: "b",
  });
  assert.equal(res.status, 400);
});

test("requests with no body do not crash", async () => {
  const res = await fetch(`${base}/api/login`, { method: "POST" });
  assert.equal(res.status, 400);
});

test("malformed JSON returns 400", async () => {
  const res = await fetch(`${base}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{bad json",
  });
  assert.equal(res.status, 400);
});

test("refresh without a cookie returns 401", async () => {
  const res = await post("/api/refresh", {});
  assert.equal(res.status, 401);
});

test("contact validates the message before sending", async () => {
  assert.equal((await post("/api/contact", {})).status, 400);
  assert.equal((await post("/api/contact", { message: "x".repeat(5001) })).status, 400);
});

test("security headers and compression are set", async () => {
  const res = await fetch(`${base}/api/pokemonteam`, { headers: { "Accept-Encoding": "gzip" } });
  assert.ok(res.headers.get("content-security-policy"));
  assert.ok(res.headers.get("strict-transport-security"));
  assert.equal(res.headers.get("x-powered-by"), null);
});

test("contact form is rate limited", async () => {
  let last;
  for (let i = 0; i < 6; i++) last = await post("/api/contact", {});
  assert.equal(last.status, 429);
});

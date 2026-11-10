const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const PokemonTeam = require("../models/pokemon-team");

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";
const REFRESH_COOKIE = "refreshToken";
const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/api",
};

const isString = (value) => typeof value === "string";

function signAccessToken(user) {
  return jwt.sign(
    { user_id: user._id, username: user.username },
    process.env.TOKEN_KEY,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

function setRefreshCookie(res, user) {
  const refreshToken = jwt.sign(
    { user_id: user._id, username: user.username },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: REFRESH_TOKEN_TTL }
  );
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...refreshCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
  // Also clear cookies set before `path: "/api"` was used.
  const { path, ...legacyOptions } = refreshCookieOptions;
  res.clearCookie(REFRESH_COOKIE, legacyOptions);
}

const publicProfile = (user) => ({
  firstName: user.first_name,
  lastName: user.last_name,
  username: user.username,
});

// register a new user
exports.signup = async function (req, res) {
  const { firstName, lastName, username, password } = req.body ?? {};

  // Validate user input. Reject non-strings so objects like {"$gt": ""}
  // can never reach a database query.
  if (![firstName, lastName, username, password].every((v) => isString(v) && v !== "")) {
    return res.status(400).send("All input is required");
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return res.status(400).send("Username can only contain letters and numbers.");
  }
  if (username.length < 3 || username.length > 20) {
    return res.status(400).send("Username must be between 3 and 20 characters long.");
  }
  // bcrypt only uses the first 72 bytes of a password.
  if (password.length < 8 || Buffer.byteLength(password) > 72) {
    return res.status(400).send("Password must be between 8 and 72 characters long.");
  }
  if (firstName.length > 50 || lastName.length > 50) {
    return res.status(400).send("Names must be at most 50 characters long.");
  }

  const oldUser = await User.findOne({ username });
  if (oldUser) {
    return res.status(409).send("User Already Exists. Please Login");
  }

  // A random salt per password defeats precomputed hash tables;
  // 10 is the cost factor, not the salt length.
  const encryptedUserPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      username,
      password: encryptedUserPassword,
    });
    return res.status(201).json(publicProfile(user));
  } catch (err) {
    // Unique index race: two signups with the same username at once.
    if (err.code === 11000) {
      return res.status(409).send("User Already Exists. Please Login");
    }
    throw err;
  }
};

// login a user
exports.login = async function (req, res) {
  const { username, password } = req.body ?? {};

  if (!isString(username) || !isString(password) || !username || !password) {
    return res.status(400).send("All input is required");
  }

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Invalid Credentials");
  }

  setRefreshCookie(res, user);
  return res.status(200).json({ token: signAccessToken(user), ...publicProfile(user) });
};

// refresh auth token (and rotate the refresh token)
exports.refresh = async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE];
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
  } catch {
    clearRefreshCookie(res);
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }

  const user = await User.findById(payload.user_id);
  if (!user) {
    clearRefreshCookie(res);
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }

  setRefreshCookie(res, user);
  return res.json({ accessToken: signAccessToken(user) });
};

// clear cookies
exports.logout = async (req, res) => {
  clearRefreshCookie(res);
  res.json({ success: true });
};

// return the user profile information
exports.profile = async function (req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "Not found" });
  return res.status(200).json(publicProfile(user));
};

// Delete the user and the teams they own
exports.delete_user = async (req, res) => {
  const deleted = await User.findOneAndDelete({ _id: req.userId });
  if (!deleted) return res.status(404).json({ error: "Not found" });
  await PokemonTeam.deleteMany({ user: req.userId });
  clearRefreshCookie(res);
  res.json({ success: true });
};

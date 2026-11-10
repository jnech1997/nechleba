const jwt = require("jsonwebtoken");

// Verify the Bearer access token and attach the user id to the request.
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Invalid token");
  }
  const token = authHeader.substring(7);
  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.userId = decoded.user_id;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

module.exports = verifyToken;

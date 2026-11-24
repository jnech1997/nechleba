// Check required secrets at startup so a bad config fails loudly
// instead of producing weak or interchangeable tokens.
exports.validateEnv = (env = process.env) => {
  const errors = [];
  for (const name of ["TOKEN_KEY", "REFRESH_TOKEN_KEY"]) {
    if (!env[name]) errors.push(`${name} is not set`);
  }
  if (env.TOKEN_KEY && env.TOKEN_KEY === env.REFRESH_TOKEN_KEY) {
    // With one shared secret, an access token would also verify as a refresh token.
    errors.push("TOKEN_KEY and REFRESH_TOKEN_KEY must be different");
  }
  return errors;
};

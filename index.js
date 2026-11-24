const http = require("http");
const app = require("./app");
const { validateEnv } = require("./config/env");

const envErrors = validateEnv();
if (envErrors.length) {
  console.error(`Invalid configuration:\n- ${envErrors.join("\n- ")}`);
  process.exit(1);
}

require("./config/database").connect();

const port = process.env.PORT || process.env.API_PORT || 4001;

http.createServer(app).listen(port, () => {
  console.log(`Server running on port ${port}`);
});

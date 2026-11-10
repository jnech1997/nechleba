const http = require("http");
const app = require("./app");
require("./config/database").connect();

const port = process.env.PORT || process.env.API_PORT || 4001;

http.createServer(app).listen(port, () => {
  console.log(`Server running on port ${port}`);
});

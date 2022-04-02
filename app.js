require("dotenv").config();
require("./config/database").connect();
var helmet = require('helmet');
const express = require("express");

const app = express();

app.use(express.json());
app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"]
    }
}));
app.use(express.static(__dirname + '/dist/portfolio'));

app.get('/pokemon', (req, res) => {
    res.status(200).send('pokemon list returned');
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname)));

module.exports = app;
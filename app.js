require("dotenv").config();
require("./config/database").connect();
const express = require("express");
var apiRouter = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/dist/portfolio'));

app.use('/api', apiRouter);

app.get('/', (req, res) => res.sendFile(path.join(__dirname)));

module.exports = app;
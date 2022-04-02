require("dotenv").config();
require("./config/database").connect();
const express = require("express");
var helmet = require('helmet');
var indexRouter = require('./routes/index');

const app = express();

app.use(express.json());
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use(express.static(__dirname + '/dist/portfolio'));

app.use('/api', indexRouter);

app.get('/', (req, res) => res.sendFile(path.join(__dirname)));

module.exports = app;
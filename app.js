require("dotenv").config();
require("./config/database").connect();
const express = require("express");
var apiRouter = require('./routes/api');


const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'http')
        res.redirect(`http://${req.header('host')}${req.url}`)
      else
        next()
    })
}

app.use(express.json());
app.use(express.static(__dirname + '/portfolio/dist/portfolio'));

app.use('/api', apiRouter);

app.get('/', (req, res) => res.sendFile(path.join(__dirname)));

module.exports = app;

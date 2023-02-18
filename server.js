const express = require('express');
const serveIndex = require('serve-index');
const path = require("path");
const router = express.Router();
const app = express();
//Set view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//
app.use('/public', express.static('public'));
app.use('/public', serveIndex('public'));

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
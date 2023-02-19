const express = require('express');
const serveIndex = require('serve-index');
var exphbs = require('express-handlebars');

const remi = require("./remi.js")

var app = express();

//Set view engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home', { title: "Remi" });
});

app.get('/remi', async function (req, res) {
    console.log(`Path ${req.query.path} was requested...`);
    res.json(await remi.startRemi((req.query.path ?? "").split().filter(i => i)));
});

//Public files
app.use('/public', express.static('public'));
app.use('/public', serveIndex('public'));

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Remi is listening on port ${port}.`));
var express = require("express");
var router = express.Router();
const remi = require("../remi.js")

router.get("/", async function(req, res, next) {
    console.log(`Path ${req.query.path} was requested...`);
    const table = await remi.startRemi((req.query.path ?? "").split(/[\/,]+/).filter(i => i));
    res.json(table);
});

module.exports = router;
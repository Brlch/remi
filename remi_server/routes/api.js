var express = require("express");
var router = express.Router();
const remi = require("../logic/remi.js");
const { getCSV, updateQueryTree, peekQueryTree , getExistingQueriesInfo} = require("../logic/webScraperQueryTree.js"); // Replace 'yourModule' with the actual module name


router.get("/", async function(req, res, next) {
    console.log(`Path ${req.query.path} was requested...`);
    console.log(`Scope ${req.query.scope}`);
    const table = await remi.processPath((req.query.path ?? "").split(/[\/]+/).filter(i => i), req.query.scope);
    res.json(table);
});

router.get("/update", async function(req, res) {
    console.log(`Updating Query Tree for Path ${req.query.path}...`);
    console.log("SCOPE YEAR"+req.query.scope+ req.query.year);
    try {
        await updateQueryTree(req.query.path,req.query.scope, req.query.year);
        res.send("Query Tree updated successfully.");
    } catch (error) {
        console.error('Error during query tree update:', error);
        res.status(500).send('Error updating Query Tree');
    }
});

router.get("/peek", async function(req, res) {
    console.log(`Updating Query Tree for Path ${req.query.path}...`);
    try {
        const result = await peekQueryTree(req.query.path, req.query.scope, req.query.year);
        res.json({ message: "Query Tree updated successfully.", result: result });
    } catch (error) {
        console.error('Error during query tree update:', error);
        res.status(500).send('Error updating Query Tree');
    }
});

router.get("/csv", async function(req, res, next) {
    console.log(`CSV for Path ${req.query.path} was requested...`);
    const csv = await getCSV(req.query.path,req.query.scope, req.query.year);

    if (csv) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=\"query-tree.csv\"');
        res.send(csv);
    } else {
        res.status(404).send('CSV could not be generated');
    }
});

router.get("/existing-queries", async function(req, res) {
    console.log(`Fetching existing queries`);
    try {
        const existingQueriesInfo = await getExistingQueriesInfo();
        console.log("Existing:",existingQueriesInfo);
        res.json(existingQueriesInfo);
    } catch (error) {
        console.error('Error during fetching existing queries:', error);
        res.status(500).send('Error fetching existing queries');
    }
});

module.exports = router;

const { Query } = require('./query.js');
const remi = require("./remi.js")

async function buildQueryTree(fullPath, executeScraper, parentQuery = null) {
    // Base case: if the path is empty, return null
    //console.log(fullPath);
    if (fullPath === "") {
        return [];
    }

    const segments = fullPath.split(/[\/,]+/).filter(i => i);
    const currentSegment = segments[0];
    const remainingPath = segments.slice(1).join('/');

    if (currentSegment === 'ALL') {
        // If the current segment is 'ALL', run the scraper to get all options
        const options = await executeScraper(parentQuery); // Use parentQuery here
        let childQueries = [];

        for (const option of options) {
            // For each option, build the subtree
            const childQuery = await buildQueryTree(`${option}/${remainingPath}`, executeScraper, parentQuery);
            if (childQuery) {
                // If the childQuery is an array, spread it into the childQueries array
                if (Array.isArray(childQuery)) {
                    childQueries.push(...childQuery);
                } else {
                    childQueries.push(childQuery);
                }
            }
        }

        return childQueries;
    } else {
        // Create the current Query node for non-'ALL' segments
        let currentQuery = new Query(fullPath, null, null, parentQuery);

        // Recursively build the tree for the remaining path
        const childQuery = await buildQueryTree(remainingPath, executeScraper, currentQuery);
        if (childQuery) {
            // If the childQuery is an array, add each element as a subquery
            if (Array.isArray(childQuery)) {
                childQuery.forEach(subQuery => currentQuery.addSubquery(subQuery));
            } else {
                currentQuery.addSubquery(childQuery);
            }
        }

        return currentQuery;
    }
}






// This function is a placeholder for your web scraping function.
async function executeScraper(node) {

    let data = await remi.processPath(node.getParentSteps())
    //console.log(data.options);
    return data.options;
}


// Self-invoking async function to test
async function updateQueryTree(path,scope) {
    let queryTree = Query.load(path,scope);

    if (queryTree == null) {
        queryTree = await buildQueryTree(path, executeScraper);
        queryTree.save(scope);
    }

    /*function printQueryTree(query, depth = 0) {
        if (!query) return;
        console.log(' '.repeat(depth * 2) + query.name);
        query.subqueries.forEach(subquery => printQueryTree(subquery, depth + 1));
    }*/

    //printQueryTree(queryTree);

    let pendingNodes = queryTree.findFalsyDataLeafNodes();
    
    for (const node of pendingNodes) {
        let steps = node.getParentSteps();
        let data = await remi.processPath(steps);
        node.data = data;
        node.lastUpdated = new Date();
        queryTree.save(scope);
    }
}

async function getCSV(path,scope){
    let queryTree = Query.load(path,scope);
    if(queryTree){
        return queryTree.buildCSV();
    }
    return "";
}

module.exports = { updateQueryTree , getCSV};

/* TESTS
//const testPath = 'A/B/ALL/C';
//const testPath= 'M: GOBIERNOS LOCALES/ctl00_CPH1_BtnSubTipoGobierno/M: MUNICIPALIDADES/ctl00_CPH1_BtnDepartamento/ALL/ctl00_CPH1_BtnMunicipalidad/ALL/ctl00_CPH1_BtnFuncion';
const testPath = 'M: GOBIERNOS LOCALES/ctl00_CPH1_BtnSubTipoGobierno/M: MUNICIPALIDADES/ctl00_CPH1_BtnDepartamento/ALL/ctl00_CPH1_BtnMunicipalidad';
// Call the function with a test path
updateQueryTree(testPath);
console.log(await getCSV(testPath));*/


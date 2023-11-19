
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class Query {
    constructor(name = null, lastUpdated = new Date(), data = null, parent = null) {
        this.name = name;
        this.lastUpdated = lastUpdated;
        this.data = data;
        this.subqueries = [];
        this.parent = parent;
    }
    getCurrentStep() {
        const steps = this.name.split(/[\/,]+/).filter(i => i)
        return steps && steps.length ? steps[0] : "";
    }

    getParentSteps() {
        const steps = [];
        let current = this;
        while (current) {
            const step = current.getCurrentStep();
            if (step) {
                steps.unshift(step); // Add the step at the beginning of the array
            }
            current = current.parent;
        }
        return steps;
    }


    addSubquery(subquery) {
        if (this.isCircularReference(subquery)) {
            throw new Error("Circular reference detected");
        }
        subquery.parent = this;
        this.subqueries.push(subquery);
    }

    isCircularReference(subquery) {
        let current = this;
        while (current) {
            if (current === subquery) {
                return true;
            }
            current = current.parent;
        }
        return false;
    }

    getLastUpdated() {
        let latest = this.lastUpdated;
        for (let subquery of this.subqueries) {
            let subLastUpdated = subquery.getLastUpdated();
            if (subLastUpdated > latest) {
                latest = subLastUpdated;
            }
        }
        return latest;
    }

    result() {
        const csvData = this.buildCSV();
        const dir = path.join(__dirname, '../queries');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        fs.writeFileSync(path.join(dir, `${this.name}.csv`), csvData);
    }

    buildCSV() {
        let rows = [];
        this.collectLeafData(rows);

        // If there are no rows, return an empty CSV
        if (rows.length === 0) {
            return '';
        }

        // Infer headers from the first row
        let firstRowColumns = rows[0].split(',');

        // Known project indicators in Spanish
        const knownHeaders = {
            "name": "Nombre",
            "pia": "PIA",
            "pim": "PIM",
            "cert": "Certificado",
            "comp": "Compromiso",
            "atco": "ATCO",
            "devn": "Devengado",
            "gira": "Girado",
            "avan": "Avance"
        };

        let headers = [];
        let knownHeadersCount = Object.keys(knownHeaders).length;
        let placeholdersCount = firstRowColumns.length - knownHeadersCount;

        // Add placeholders for unspecified columns
        for (let i = 0; i < placeholdersCount; i++) {
            headers.push(`---`);
        }

        // Add known headers
        Object.values(knownHeaders).forEach(header => {
            headers.push(header);
        });

        // Prepend the headers row to the rows
        return [headers.join(','), ...rows].join('\n');
    }

    collectLeafData(rows) {
        let leafs = this.findDataLeafNodes();

        leafs.forEach(leaf => {
            // Process each step for better readability
            let steps = leaf.getParentSteps().map(step => {
                return step.replace(/^[A-Z]:\s*/, '')  // Remove prefixes like "M:"
                    .replace(/^\d+:\s*/, '');  // Remove numeric prefixes like "25: "
            }).filter(step => !step.match(/ctl00_CPH1/)); // Filter out patterns like "ctl00_CPH1..."

            // If leaf has data and data has rows, process each row
            if (leaf.data && Array.isArray(leaf.data.rows)) {
                leaf.data.rows.forEach(row => {
                    // Filter out the "id" field and process the remaining values for the CSV row
                    let rowData = Object.entries(row)
                        .filter(([key, _]) => key !== 'id')
                        .map(([_, value]) => {
                            // Remove commas from all string values
                            if (typeof value === 'string') {
                                return value.replace(/,/g, '');
                            }
                            return value;
                        })
                        .join(', ');

                    let csvRow = [...steps, rowData].join(',');
                    rows.push(csvRow);
                });
            }
        });
    }

    findLeafNodes(predicate) {
        let leafNodes = [];

        const traverse = (query) => {
            if (query.subqueries.length === 0) {
                if (predicate(query)) {
                    leafNodes.push(query);
                }
            } else {
                query.subqueries.forEach(subquery => traverse(subquery));
            }
        };

        traverse(this);
        return leafNodes;
    }

    findAllLeafNodes() {
        return this.findLeafNodes(query => true);
    }
    findDataLeafNodes() {
        return this.findLeafNodes(query => query.data !== undefined);
    }

    findFalsyDataLeafNodes() {
        return this.findLeafNodes(query => !query.data);
    }

    static getDirPath(scope, year) {
        const baseDir = path.join(__dirname, '../queries');
        return scope && year ? path.join(baseDir, scope, year) : baseDir;
    }
    static generateHash(name) {
        return crypto.createHash('sha256').update(name).digest('hex');
    }


    static load(name, scope, year) {
        let filePath;
        
        if (arguments.length === 1) {
            // If only one argument is provided, assume it's the file name
            filePath = name;
        } else {
            // Otherwise, use name, scope, and year to determine the file path
            const dir = Query.getDirPath(scope, year);
            const hash = Query.generateHash(name);
            filePath = path.join(dir, `${hash}.json`);
        }
        
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const queryObject = JSON.parse(data);

            // Function to recursively create Query objects from the parsed data
            const createQueryFromObject = (obj, parent = null) => {
                const query = new Query(obj.name, new Date(obj.lastUpdated), obj.data, parent);
                query.subqueries = obj.subqueries.map(subObj => createQueryFromObject(subObj, query));
                return query;
            };

            return createQueryFromObject(queryObject);
        } catch (err) {
            console.error(err);
            return null;
        }
    }


    save(scope, year) {
        const dir = Query.getDirPath(scope, year);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        try {
            const hash = Query.generateHash(this.name);
            const filePath = path.join(dir, `${hash}.json`);

            const replacer = (key, value) => {
                if (key === 'parent') return undefined; // Omit the parent property
                return value;
            };

            const data = JSON.stringify(this, replacer, 2);
            fs.writeFileSync(filePath, data, 'utf8');
        } catch (err) {
            console.error(err);
        }
    }

    static getExistingQueriesInfo() {
        let queriesInfo = [];
        const baseDir = Query.getDirPath();

        // List all scope directories
        const scopes = fs.readdirSync(baseDir).filter(item => {
            const itemPath = path.join(baseDir, item);
            return fs.statSync(itemPath).isDirectory();
        });

        // Iterate over each scope and list all years
        scopes.forEach(scope => {
            const scopeDir = path.join(baseDir, scope);
            const years = fs.readdirSync(scopeDir).filter(item => {
                const itemPath = path.join(scopeDir, item);
                return fs.statSync(itemPath).isDirectory();
            });

            // Iterate over each year and read query files
            years.forEach(year => {
                const yearDir = path.join(scopeDir, year);
                const files = fs.readdirSync(yearDir).filter(file => file.endsWith('.json'));

                // Process each query file
                files.forEach(file => {
                    const filePath = path.join(yearDir, file);

                    // Load the query if it is a root query
                    const query = Query.load(filePath);
                    if (query !== null && query.parent === null) {
                        queriesInfo.push({
                            scope: scope,
                            year: year,
                            originalRootPath: yearDir,
                            originalRootName: query.name,
                            originalPathName: query.path,
                            lastUpdateTime: query.lastUpdated
                        });
                    }
                });
            });
        });

        return queriesInfo;
    }
}

module.exports = { Query };
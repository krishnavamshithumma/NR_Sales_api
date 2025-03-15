const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

function parseCSV(filename) {
    const filePath = path.join(__dirname, "../data", filename);
    const file = fs.readFileSync(filePath, "utf8");
    return Papa.parse(file, { header: true }).data;
}

module.exports = { parseCSV };

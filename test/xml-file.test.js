const parser = require('fast-xml-parser');
const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(path.join(__dirname, "./files/file.xml"), "utf8");

const options = {
    ignoreAttributes: false
};

const obj = parser.parse(content, options);

console.log(obj);
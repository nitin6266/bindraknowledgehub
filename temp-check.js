var fs = require("fs");
var c = fs.readFileSync("package.json", "utf8");
c.split("\n").forEach(function(l, i) { console.log(i + ": " + JSON.stringify(l)); });

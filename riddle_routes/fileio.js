const fs = require("fs");
const csv = require("csvtojson");
const { Parser } = require('json2csv');

(async () => {

    const handicap = await csv().fromFile("handicap.csv");
    
    console.log(handicap);

    const handicapInCsv = new Parser({ fields: ["Latitude", "Longitude"] }).parse(handicap);
    fs.writeFileSync("handicap.csv", handicapInCsv);

})();
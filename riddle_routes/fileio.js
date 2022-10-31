const fs = require('fs');
const { parse } = require('csv-parse');

const handicapData = [];

fs.createReadStream(__dirname + '/handicap.csv')
    .pipe(
        parse({
            delimiter: ","
        })
    )
    .on('data', function (dataRow) {
        handicapData.push(dataRow);
    })
    .on('end', function () {
        console.log(handicapData);
    });
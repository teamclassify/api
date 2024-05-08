const toJSON = require("convert-excel-to-json");

function excelToJson(file) {
    const excelData = toJSON({
        sourceFile: file.path,
        header: {
          rows: 1
        },
        columnToKey: {
          "*" : "{{columnHeader}}"
        },
      });

    return excelData;
}

module.exports = excelToJson;

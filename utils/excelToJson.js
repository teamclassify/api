const toJSON = require("convert-excel-to-json");

function excelToJson(file) {
  const excelData = toJSON({
    source: file.buffer,
    header: {
      rows: 1,
    },
    columnToKey: {
      "*": "{{columnHeader}}",
    },
  });

  return excelData;
}

module.exports = excelToJson;


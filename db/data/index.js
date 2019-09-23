const ENV = process.env.NODE_ENV || "development";
const { developmentData } = require("./development-data");
const { testData } = require("./test-data");

const Data = {
  development: developmentData,
  test: testData
};
module.exports = Data[ENV];

const { col } = require("sequelize");
const moment = require("moment");
const loadJsonFile = require("load-json-file");
const fs = require("fs");
const path = require("path");

module.exports = {
  async getAttributes(facilityType) {
    if (facilityType === "province") {
      return col("RequestingProvinceName");
    } else if (facilityType === "district") {
      return col("RequestingDistrictName");
    } else if (facilityType === "clinic") {
      return col("RequestingFacilityName");
    }
  },

  async checkCache(params, id) {
    const defaultStartDate = moment().subtract(1, "year").format("YYYY-MM-DD");
    const defaultEndDate = moment().format("YYYY-MM-DD");
    const defaultAge = ["15", "49"];
    const filePath = path.join(__dirname, `../../cache/${id}.json`);

    if (fs.existsSync(filePath)) {
      if (
        params.dates[0] === defaultStartDate &&
        params.dates[1] === defaultEndDate &&
        (params.codes === [] || !params.codes) &&
        (JSON.stringify(params.age || "A") === JSON.stringify(defaultAge) ||
          !params.age)
      ) {
        return await loadJsonFile(filePath);
      } else {
        return null;
      }
    } else {
      return null;
    }
  },
};

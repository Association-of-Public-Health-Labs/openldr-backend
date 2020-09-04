const { col } = require("sequelize");
const moment = require("moment");
const loadJsonFile = require("load-json-file");
const fs = require("fs");
const path = require("path");

module.exports = {
  async getAttributes(facilityType, disaggregation) {
    if (facilityType === "province") {
      if (disaggregation) {
        return { column: col("RequestingDistrictName"), type: "district" };
      }
      return { column: col("RequestingProvinceName"), type: "province" };
    } else if (facilityType === "district") {
      if (disaggregation) {
        return { column: col("RequestingFacilityName"), type: "clinic" };
      }
      return { column: col("RequestingDistrictName"), type: "district" };
    } else if (facilityType === "clinic") {
      return { column: col("RequestingFacilityName"), type: "clinic" };
    } else {
      return { column: col("RequestingProvinceName"), type: "province" };
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

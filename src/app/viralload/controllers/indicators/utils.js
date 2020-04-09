const { col } = require("sequelize");
const moment = require("moment");
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

  async checkCache(params, defaultDates) {
    const defaultStartDate = moment().subtract(1, "year").format("YYYY-MM-DD");
    const defaultEndDate = moment().format("YYYY-MM-DD");
    const defaultAge = [15, 49];

    if (
      params.dates[0] === defaultDates[0] &&
      params.dates[1] === defaultDates[1] &&
      (params.codes === [] || !params.codes) &&
      (params.age === defaultAge || !params.age)
    ) {
      return true;
    }
    return false;
  },
};

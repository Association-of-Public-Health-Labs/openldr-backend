const sequelize = require("sequelize");
const VlData = require("../../models/VlData");
const {
  collection_reception,
  reception_registration,
  registration_analysis,
  analysis_validation,
  year,
  quarter,
  month,
  month_name,
  week
} = require("./global");

module.exports = {
  async accumulative(clause) {
    const data = await VlData.findAll({
      attributes: [
        collection_reception,
        reception_registration,
        registration_analysis,
        analysis_validation
      ],
      where: [clause]
    });
    return data;
  },

  async yearly(clause) {
    const data = await VlData.findAll({
      attributes: [
        [year, "year"],
        collection_reception,
        reception_registration,
        registration_analysis,
        analysis_validation
      ],
      where: [clause],
      group: [year],
      order: [[year, "ASC"]]
    });
    return data;
  },

  async quarterly(clause) {
    const data = await VlData.findAll({
      attributes: [
        [year, "year"],
        [quarter, "quarter"],
        collection_reception,
        reception_registration,
        registration_analysis,
        analysis_validation
      ],
      where: [clause],
      group: [year, quarter],
      order: [year, [quarter, "DESC"]]
    });
    return data;
  },

  async monthly(clause) {
    const data = await VlData.findAll({
      attributes: [
        [year, "year"],
        [month, "month"],
        [month_name, "month_name"],
        collection_reception,
        reception_registration,
        registration_analysis,
        analysis_validation
      ],
      where: [clause],
      group: [year, month, month_name],
      order: [
        [year, "ASC"],
        [month, "ASC"],
        [month_name, "ASC"]
      ]
    });
    return data;
  },

  async weekly(clause) {
    const data = await VlData.findAll({
      attributes: [
        [year, "year"],
        [month, "month"],
        [month_name, "month_name"],
        [week, "week"],
        collection_reception,
        reception_registration,
        registration_analysis,
        analysis_validation
      ],
      where: [clause],
      group: [year, month, month_name, [week, "week"]],
      order: [
        [year, "ASC"],
        [month, "ASC"],
        [month_name, "ASC"],
        [week, "ASC"]
      ]
    });
    return data;
  }
};

const VlData = require("../models/VlData");
const global = require("./indicators/global");
const { col, literal, fn, Op } = require("sequelize");
const path = require("path");

module.exports = {
  async getNumberOfSamples(req, res) {
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.total, "total"],
      ],
      where: [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
        },
      ],
      group: [global.year, global.month],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
      ],
    });

    return res.json(data);
  },

  async getViralSuppression(req, res) {
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
      ],
      where: [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
        },
      ],
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
      ],
    });
    console.log(data);
    return res.json(data);
  },

  async getTurnAroundTime(req, res) {
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.collection_reception, "collection_reception"],
        [global.reception_registration, "reception_registration"],
        [global.registration_analysis, "registration_analysis"],
        [global.analysis_validation, "analysis_validation"],
      ],
      where: [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
        },
      ],
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
      ],
    });

    return res.json(data);
  },

  async getViralSuppressionMap(req, res) {
    const data = await VlData.findAll({
      attributes: [
        [col("RequestingProvinceName"), "province"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.routine, "routine"],
        [global.treatment_failure, "treatment_failure"],
        [global.reason_not_specified, "reason_not_specified"],
      ],
      where: [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
          RequestingProvinceName: {
            [Op.not]: null,
          },
        },
      ],
      group: [col("RequestingProvinceName")],
      order: [[col("RequestingProvinceName"), "ASC"]],
    });
    console.log(data);
    return res.json(data);
  },

  async getSamplesIndicators(req, res) {
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.total, "registered"],
        [global.tested, "tested"],
        [global.suppressed, "suppressed"],
        [global.rejected, "rejected"],
        [global.non_validated, "non_validated"],
      ],
      where: [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
        },
      ],
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
      ],
    });
    return res.json(data);
  },

  async getTatVsDisalinks(req, res) {
    const loadJsonFile = require("load-json-file");
    return res.json(
      await loadJsonFile(path.join(__dirname, "tat_vs_disalinks.json"))
    );
  },
};

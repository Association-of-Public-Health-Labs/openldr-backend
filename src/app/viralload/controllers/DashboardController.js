const VlData = require("../models/VlData");
const global = require("./indicators/global");
const utils = require("./indicators/utils");
const { col, literal, fn, Op } = require("sequelize");
const path = require("path");
const loadJsonFile = require("load-json-file");
const moment = require("moment");

module.exports = {
  async getNumberOfSamples(req, res) {
    const id = "dash_number_of_samples";
    const defaultDates = [
      moment().subtract(1, "year").format("YYYY-MM-DD"),
      moment().format("YYYY-MM-DD"),
    ];
    if (await utils.checkCache(req.query, defaultDates)) {
      return res.json(
        await loadJsonFile(path.join(__dirname, `../cache/${id}.json`))
      );
    }
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
    const id = "dash_viral_suppression";
    const defaultDates = [
      moment().subtract(1, "year").format("YYYY-MM-DD"),
      moment().format("YYYY-MM-DD"),
    ];
    if (await utils.checkCache(req.query, defaultDates)) {
      return res.json(
        await loadJsonFile(path.join(__dirname, `../cache/${id}.json`))
      );
    }
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
    return res.json(data);
  },

  async getTurnAroundTime(req, res) {
    const id = "dash_tat";
    const defaultDates = [
      moment().subtract(1, "year").format("YYYY-MM-DD"),
      moment().format("YYYY-MM-DD"),
    ];
    if (await utils.checkCache(req.query, defaultDates)) {
      return res.json(
        await loadJsonFile(path.join(__dirname, `../cache/${id}.json`))
      );
    }
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
    const id = "dash_viral_suppression_map";
    const defaultDates = [
      moment().subtract(1, "year").format("YYYY-MM-DD"),
      moment().format("YYYY-MM-DD"),
    ];
    if (await utils.checkCache(req.query, defaultDates)) {
      return res.json(
        await loadJsonFile(path.join(__dirname, `../cache/${id}.json`))
      );
    }
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
    return res.json(data);
  },

  async getSamplesIndicators(req, res) {
    const id = "dash_sampes_indicators";
    const defaultDates = [
      moment().subtract(1, "year").format("YYYY-MM-DD"),
      moment().subtract(1, "month").format("YYYY-MM-DD"),
    ];
    if (await utils.checkCache(req.query, defaultDates)) {
      return res.json(
        await loadJsonFile(path.join(__dirname, `../cache/${id}.json`))
      );
    }
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
    return res.json(
      await loadJsonFile(
        path.join(__dirname, "../cache/dash_tat_vs_disalinks.json")
      )
    );
  },
};

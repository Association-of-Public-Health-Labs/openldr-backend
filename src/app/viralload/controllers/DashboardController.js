const VlData = require("../models/VlData");
const global = require("./indicators/global");
const utils = require("./indicators/utils");
const { col, literal, fn, Op } = require("sequelize");
const sequelize = require("sequelize");
const path = require("path");
const loadJsonFile = require("load-json-file");
const moment = require("moment");

const dates = [
  moment().subtract(1, "years").format("YYYY-MM-DD"),
  moment().format("YYYY-MM-DD"),
];

// const dates = [
//   "2020-03-01", "2021-03-30"
// ];

module.exports = {
  async getNumberOfSamples(req, res) {
    const id = "dash_number_of_samples";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.total, "total"],
      ],
      where: [
        {
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
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
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
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
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          [Op.and]: {
            ViralLoadResultCategory: {
              [Op.not]: null,
            },
            ViralLoadResultCategory: {
              [Op.notLike]: "",
            },
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
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
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
          [Op.and]: {
            AnalysisDatetime: {
              [Op.between]: req.query.dates || dates,
            },
            ViralLoadResultCategory: {
              [Op.not]: null,
            },
            ViralLoadResultCategory: {
              [Op.notLike]: "",
            },
            [Op.and]: sequelize.where(
              fn(
                "datediff",
                literal("day"),
                col("SpecimenDatetime"),
                col("AuthorisedDatetime")
              ),
              {
                [Op.lt]: 90,
              }
            ),
            [Op.and]: sequelize.where(
              fn(
                "datediff",
                literal("day"),
                col("SpecimenDatetime"),
                col("ReceivedDatetime")
              ),
              {
                [Op.gte]: 0,
              }
            ),
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
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
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
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          [Op.and]: {
            ViralLoadResultCategory: {
              [Op.not]: null,
            },
            ViralLoadResultCategory: {
              [Op.notLike]: "",
            },
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
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    const data = await VlData.findAll({
      attributes: [
        [fn("year", col("RegisteredDatetime")), "year"],
        [fn("month", col("RegisteredDatetime")), "month"],
        [
          fn("datename", literal("MONTH"), col("RegisteredDatetime")),
          "month_name",
        ],
        [global.total, "registered"],
        [global.tested, "tested"],
        [global.suppressed, "suppressed"],
        [global.rejected, "rejected"],
        [global.non_validated, "non_validated"],
      ],
      where: [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ],
      group: [
        fn("year", col("RegisteredDatetime")),
        fn("month", col("RegisteredDatetime")),
        fn("datename", literal("MONTH"), col("RegisteredDatetime")),
      ],
      order: [
        [fn("year", col("RegisteredDatetime")), "ASC"],
        [fn("month", col("RegisteredDatetime")), "ASC"],
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

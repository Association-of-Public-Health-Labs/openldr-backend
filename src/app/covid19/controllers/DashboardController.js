const Covid19 = require("../models/Covid19");
const { col, literal, fn, Op, where } = require("sequelize");
const moment = require("moment");

module.exports = {
  async getNumberOfSamples(req, res) {
    const data = await Covid19.findAll({
      attributes: [
        [fn("year", col("RegisteredDatetime")), "year"],
        [fn("month", col("RegisteredDatetime")), "month"],
        [fn("day", col("RegisteredDatetime")), "day"],
        [fn("count", literal("1")), "total"],
      ],
      group: [
        fn("year", col("RegisteredDatetime")),
        fn("month", col("RegisteredDatetime")),
        fn("day", col("RegisteredDatetime")),
      ],
      order: [
        [fn("year", col("RegisteredDatetime")), "ASC"],
        [fn("month", col("RegisteredDatetime")), "ASC"],
        [fn("day", col("RegisteredDatetime")), "ASC"],
      ],
      where: {
        RegisteredDateTime: {
          [Op.between]: req.query.dates,
        },
      },
    });

    return res.json(data);
  },

  async getTestedSamples(req, res) {
    const data = await Covid19.findAll({
      attributes: [
        [fn("year", col("AnalysisDatetime")), "year"],
        [fn("month", col("AnalysisDatetime")), "month"],
        [fn("day", col("AnalysisDatetime")), "day"],
        [fn("count", literal("1")), "total"],
        [
          fn(
            "count",
            literal(
              `CASE WHEN COVID19Result LIKE 'SARS COVID-19 Positivo' THEN 1 ELSE NULL END`
            )
          ),
          "positive",
        ],
      ],
      group: [
        fn("year", col("AnalysisDatetime")),
        fn("month", col("AnalysisDatetime")),
        fn("day", col("AnalysisDatetime")),
      ],
      order: [
        [fn("year", col("AnalysisDatetime")), "ASC"],
        [fn("month", col("AnalysisDatetime")), "ASC"],
        [fn("day", col("AnalysisDatetime")), "ASC"],
      ],
      where: {
        AnalysisDateTime: {
          [Op.between]: req.query.dates,
        },
      },
    });
    return res.json(data);
  },

  async getPositiveSamplesByProvince(req, res) {
    const data = await Covid19.findAll({
      attributes: [
        [col("RequestingProvinceName"), "province"],
        [fn("count", literal("1")), "total"],
        [
          fn(
            "count",
            literal(`CASE WHEN AnalysisDatetime IS NULL THEN 1 ELSE NULL END`)
          ),
          "pending",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN COVID19Result LIKE 'SARS COVID-19 Positivo' THEN 1 ELSE NULL END`
            )
          ),
          "positive",
        ],
      ],
      group: [col("RequestingProvinceName")],
      where: {
        AnalysisDateTime: {
          [Op.between]: req.query.dates,
        },
      },
      // where: where(
      //   fn("cast", literal(`AnalysisDatetime as date`)),
      //   "=",
      //   "2020-05-14"
      // ),
    });
    return res.json(data);
  },

  async getGlobalReport(req, res) {
    const dates = req.query.dates;
    const startDate = dates[0];
    const endDate = dates[1];
    const data = await Covid19.findAll({
      attributes: [
        [col("RequestingProvinceName"), "RequestingProvinceName"],
        [
          fn(
            "count",
            literal(
              `CASE WHEN CAST(ISNULL(RegisteredDatetime,RegisteredDateTime) AS DATE) >= '${startDate}' AND CAST(ISNULL(RegisteredDatetime,RegisteredDateTime) AS DATE) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "samples_receipt",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN CAST(AnalysisDateTime AS date) >= '${startDate}' AND CAST(AnalysisDateTime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "samples_tested",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN CAST(AnalysisDateTime AS date) >= '${startDate}' AND CAST(AnalysisDateTime AS date) <= '${endDate}' AND AuthorisedDatetime IS NOT NULL THEN 1 ELSE NULL END`
            )
          ),
          "samples_authorised",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN AnalysisDateTime IS NULL AND (LIMSRejectionCode = '' OR LIMSRejectionCode IS NULL) THEN 1 ELSE NULL END`
            )
          ),
          `samples_pending`,
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN CAST(AnalysisDateTime AS date) >= '${startDate}' AND CAST(AnalysisDateTime AS date) <= '${endDate}' AND ((LIMSRejectionCode <> '' AND LIMSRejectionCode IS NOT NULL) OR (LIMSRejectionCode <> '' AND LIMSRejectionCode IS NOT NULL)) THEN 1 ELSE NULL END`
            )
          ),
          "samples_rejected",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN COVID19Result IN ('SARS COVID-19 Positivo','SARS-CoV-2 Positivo') AND CAST(AnalysisDateTime AS date) >= '${startDate}' AND CAST(AnalysisDateTime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "samples_positive",
        ],
      ],
      group: [col("RequestingProvinceName")],
    });

    return res.json(data);
  },

  async getTAT(req, res) {
    const data = await Covid19.findAll({
      attributes: [
        [fn("year", col("AnalysisDatetime")), "year"],
        [fn("month", col("AnalysisDatetime")), "month"],
        [
          fn("datename", literal("MONTH"), col("AnalysisDatetime")),
          "month_name",
        ],
        [fn("datepart", literal("WEEK"), col("AnalysisDatetime")), "week"],
        [
          fn(
            "avg",
            literal(`DATEDIFF(DAY,SpecimenDatetime, RegisteredDatetime)`)
          ),
          "collection_registration",
        ],
        [
          fn(
            "avg",
            literal(`DATEDIFF(DAY,RegisteredDatetime, AnalysisDatetime)`)
          ),
          "registration_analysis",
        ],
        [
          fn(
            "avg",
            literal(`DATEDIFF(DAY, AnalysisDatetime, AuthorisedDatetime)`)
          ),
          "analysis_authorization",
        ],
      ],
      group: [
        fn("year", col("AnalysisDatetime")),
        fn("month", col("AnalysisDatetime")),
        fn("datename", literal("MONTH"), col("AnalysisDatetime")),
        fn("datepart", literal("WEEK"), col("AnalysisDatetime")),
      ],
      order: [
        [fn("year", col("AnalysisDatetime")), "ASC"],
        [fn("month", col("AnalysisDatetime")), "ASC"],
        [fn("datepart", literal("WEEK"), col("AnalysisDatetime")), "ASC"],
      ],
      where: {
        AnalysisDateTime: {
          [Op.between]: req.query.dates,
        },
      },
    });

    return res.json(data);
  },
};

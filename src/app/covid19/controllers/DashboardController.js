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
      //   where: where(
      //     fn("cast", literal(`AnalysisDatetime as date`)),
      //     "=",
      //     "2020-05-14"
      //   ),
    });
    return res.json(data);
  },

  async getPositiveSamplesByProvince() {
    const data = await Covid19.findAll({
      attributes: [
        [col("RequestingProvinceName"), "province"],
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
      group: [col("RequestingProvinceName")],
      where: where(
        fn("cast", literal(`AnalysisDatetime as date`)),
        "=",
        "2020-05-14"
      ),
    });
  },
};

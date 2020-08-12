const Covid19 = require("../models/Covid19");
const { col, literal, fn, Op, where } = require("sequelize");
const moment = require("moment");

module.exports = {
  async getNumberOfSamples(req, res) {
    console.log(req.query.dates);
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
        [fn("year", col("AuthorisedDatetime")), "year"],
        [fn("month", col("AuthorisedDatetime")), "month"],
        [
          fn("datename", literal("MONTH"), col("AuthorisedDatetime")),
          "month_name",
        ],
        [fn("day", col("AuthorisedDatetime")), "day"],
        [fn("count", literal("1")), "total"],
        [
          fn(
            "count",
            literal(
              `CASE WHEN COVID19Result IN ('SARS COVID-19 Positivo','SARS-CoV-2 Positivo') THEN 1 ELSE NULL END`
            )
          ),
          "positive",
        ],
      ],
      group: [
        fn("year", col("AuthorisedDatetime")),
        fn("month", col("AuthorisedDatetime")),
        fn("datename", literal("MONTH"), col("AuthorisedDatetime")),
        fn("day", col("AuthorisedDatetime")),
      ],
      order: [
        [fn("year", col("AuthorisedDatetime")), "ASC"],
        [fn("month", col("AuthorisedDatetime")), "ASC"],
        [fn("day", col("AuthorisedDatetime")), "ASC"],
      ],
      where: literal(
        `CAST(AuthorisedDatetime AS date) >= '${req.query.dates[0]}' AND CAST(AuthorisedDatetime AS date) <= '${req.query.dates[1]}'`
      ),
    });
    return res.json(data);
  },

  async getPositiveSamplesByProvince(req, res) {
    const dates = req.query.dates;
    const startDate = dates[0];
    const endDate = dates[1];
    const data = await Covid19.findAll({
      attributes: [
        [col("RequestingProvinceName"), "province"],
        [
          fn(
            "count",
            literal(
              `CASE WHEN CAST(AnalysisDatetime AS date) >= '${startDate}' AND CAST(AnalysisDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "total",
        ],
        [
          fn(
            "count",
            literal(`CASE WHEN AuthorisedDatetime IS NULL THEN 1 ELSE NULL END`)
          ),
          "pending",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN COVID19Result IN ('SARS COVID-19 Positivo','SARS-CoV-2 Positivo') AND CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "positive",
        ],
      ],
      group: [col("RequestingProvinceName")],
      // where: literal(
      //   `CAST(AuthorisedDatetime AS date) >= '${req.query.dates[0]}' AND CAST(AuthorisedDatetime AS date) <= '${req.query.dates[1]}'`
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
              `CASE WHEN CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
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
              `CASE WHEN COVID19Result IN ('SARS COVID-19 Positivo','SARS-CoV-2 Positivo') AND CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "samples_positive",
        ],
      ],
      group: [col("RequestingProvinceName")],
      where: {
        [Op.and]: {
          RequestingProvinceName: {
            [Op.not]: null,
          },
          RequestingProvinceName: {
            [Op.notLike]: "",
          },
        },
      },
    });

    return res.json(data);
  },

  async getIndicatorsByProvince(req, res) {
    const dates = req.query.dates;
    const provinces = req.query.provinces;
    const startDate = dates[0];
    const endDate = dates[1];
    const data = await Covid19.findAll({
      attributes: [
        [col("RequestingProvinceName"), "RequestingProvinceName"],
        [col("RequestingDistrictName"), "RequestingDistrictName"],
        [col("RequestingFacilityName"), "RequestingFacilityName"],
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
              `CASE WHEN CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
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
              `CASE WHEN COVID19Result IN ('SARS COVID-19 Positivo','SARS-CoV-2 Positivo') AND CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "samples_positive",
        ],
      ],
      group: [
        col("RequestingProvinceName"),
        col("RequestingDistrictName"),
        col("RequestingFacilityName"),
      ],
      order: [
        col("RequestingProvinceName"),
        col("RequestingDistrictName"),
        col("RequestingFacilityName"),
      ],
      where: {
        [Op.and]: {
          RequestingProvinceName: {
            [Op.in]: provinces,
          },
        },
      },
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
        [fn("datepart", literal("DAY"), col("AnalysisDatetime")), "day"],
        [
          fn(
            "avg",
            literal(`DATEDIFF(HOUR,SpecimenDatetime, ReceivedDatetime)`)
          ),
          "collection_reception",
        ],
        [
          fn(
            "avg",
            literal(`DATEDIFF(HOUR,ReceivedDatetime, RegisteredDatetime)`)
          ),
          "reception_registration",
        ],
        [
          fn(
            "avg",
            literal(`DATEDIFF(HOUR, RegisteredDatetime, AnalysisDatetime)`)
          ),
          "registration_analysis",
        ],
        [
          fn(
            "avg",
            literal(`DATEDIFF(HOUR, AnalysisDatetime, AuthorisedDatetime)`)
          ),
          "analysis_authorization",
        ],
      ],
      group: [
        fn("year", col("AnalysisDatetime")),
        fn("month", col("AnalysisDatetime")),
        fn("datename", literal("MONTH"), col("AnalysisDatetime")),
        fn("datepart", literal("DAY"), col("AnalysisDatetime")),
      ],
      order: [
        [fn("year", col("AnalysisDatetime")), "ASC"],
        [fn("month", col("AnalysisDatetime")), "ASC"],
        [fn("datepart", literal("DAY"), col("AnalysisDatetime")), "ASC"],
      ],
      where: {
        AnalysisDateTime: {
          [Op.between]: req.query.dates,
        },
      },
    });

    return res.json(data);
  },

  async getPositiveCasesByGender(req, res) {
    const data = await Covid19.findAll({
      attributes: [
        [
          fn(
            "count",
            literal(`CASE WHEN HL7SexCode = 'M' THEN 1 ELSE NULL END`)
          ),
          "male",
        ],
        [
          fn(
            "count",
            literal(`CASE WHEN HL7SexCode = 'F' THEN 1 ELSE NULL END`)
          ),
          "female",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN HL7SexCode NOT IN ('F','M') THEN 1 ELSE NULL END`
            )
          ),
          "not_specified",
        ],
      ],
      where: {
        AnalysisDateTime: {
          [Op.between]: req.query.dates,
        },
        Covid19Result: {
          [Op.in]: ["SARS COVID-19 Positivo", "SARS-CoV-2 Positivo"],
        },
      },
    });
    return res.json(data);
  },
};

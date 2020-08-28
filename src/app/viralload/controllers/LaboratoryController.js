const samples = require("./indicators/samples");
const sequelize = require("sequelize");
const global = require("./indicators/global");
const utils = require("./indicators/utils");
const VlData = require("../models/VlData");
const { Op, fn, literal, col } = sequelize;
const moment = require("moment");

const dates = [
  moment().subtract(1, "years").format("YYYY-MM-DD"),
  moment().format("YYYY-MM-DD"),
];

const age = [15, 49];

// const dates = ["2019-08-27", "2020-08-27"];

module.exports = {
  async getSamplesByTestReason(req, res) {
    const id = "lab_samples_by_test_reason";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ];
    }

    const data = await samples.accumulative(where, [
      [sequelize.fn("count", sequelize.literal("1")), "total"],
      [global.routine, "routine"],
      [global.treatment_failure, "treatment_failure"],
      [global.reason_not_specified, "reason_not_specified"],
    ]);

    return res.json(data);
  },

  async getSamplesTestedByMonth(req, res) {
    const id = "lab_samples_tested_by_month";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [fn("year", col("AnalysisDatetime")), "year"],
        [fn("month", col("AnalysisDatetime")), "month"],
        [
          fn("datename", literal("MONTH"), col("AnalysisDatetime")),
          "month_name",
        ],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: where,
      group: [
        fn("year", col("AnalysisDatetime")),
        fn("month", col("AnalysisDatetime")),
        fn("datename", literal("MONTH"), col("AnalysisDatetime")),
      ],
      order: [
        [fn("year", col("AnalysisDatetime")), "ASC"],
        [fn("month", col("AnalysisDatetime")), "ASC"],
      ],
    });
    return res.json(data);
  },

  async getSamplesTestedByLab(req, res) {
    const id = "lab_samples_tested_by_lab";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          TestingFacilityName: {
            [Op.not]: null,
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          TestingFacilityName: {
            [Op.not]: null,
          },
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [col("TestingFacilityName"), "lab"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: where,
      group: [col("TestingFacilityName")],
      order: [[col("TestingFacilityName"), "ASC"]],
    });
    return res.json(data);
  },

  async getTurnaroundTimeByMonth(req, res) {
    const id = "lab_tat_by_month";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
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
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
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
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [fn("year", col("AnalysisDatetime")), "year"],
        [fn("month", col("AnalysisDatetime")), "month"],
        [
          fn("datename", literal("MONTH"), col("AnalysisDatetime")),
          "month_name",
        ],
        [global.collection_reception, "collection_reception"],
        [global.reception_registration, "reception_registration"],
        [global.registration_analysis, "registration_analysis"],
        [global.analysis_validation, "analysis_validation"],
      ],
      where: where,
      group: [
        fn("year", col("AnalysisDatetime")),
        fn("month", col("AnalysisDatetime")),
        [
          fn("datename", literal("MONTH"), col("AnalysisDatetime")),
          "month_name",
        ],
      ],
      order: [
        [fn("year", col("AnalysisDatetime")), "ASC"],
        [fn("month", col("AnalysisDatetime")), "ASC"],
      ],
    });
    res.json(data);
  },

  async getTurnaroundTimeByLab(req, res) {
    const id = "lab_tat_by_lab";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          [Op.and]: {
            TestingFacilityCode: {
              [Op.not]: null,
            },
          },
          TestingFacilityName: {
            [Op.not]: null,
          },
          // TestingFacilityCode: [
          //   literal(`distinct TestingFacilityCode, TestingFacilityName`),
          // ],
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
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          TestingFacilityName: {
            [Op.not]: null,
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
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [col("TestingFacilityName"), "lab"],
        [global.collection_reception, "collection_reception"],
        [global.reception_registration, "reception_registration"],
        [global.registration_analysis, "registration_analysis"],
        [global.analysis_validation, "analysis_validation"],
      ],
      where: where,
      group: [col("TestingFacilityName")],
      order: [[col("TestingFacilityName"), "ASC"]],
    });
    res.json(data);
  },

  async getSamplesTestedByGender(req, res) {
    const id = "lab_samples_tested_by_gender_monthly";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          AnalysisDatetime: {
            [Op.between]: dates,
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [fn("year", col("AnalysisDatetime")), "year"],
        [fn("month", col("AnalysisDatetime")), "month"],
        [
          fn("datename", literal("MONTH"), col("AnalysisDatetime")),
          "month_name",
        ],
        [global.total, "total"],
        [global.male_suppressed, "male_suppressed"],
        [global.female_suppressed, "female_suppressed"],
        [global.male_not_suppressed, "male_not_suppressed"],
        [global.female_not_suppressed, "female_not_suppressed"],
      ],
      where: where,
      group: [
        fn("year", col("AnalysisDatetime")),
        fn("month", col("AnalysisDatetime")),
        fn("datename", literal("MONTH"), col("AnalysisDatetime")),
      ],
      order: [
        [fn("year", col("AnalysisDatetime")), "ASC"],
        [fn("month", col("AnalysisDatetime")), "ASC"],
      ],
    });
    return res.json(data);
  },

  async getSamplesTestedByGenderAndLab(req, res) {
    const id = "lab_samples_tested_by_gender_and_lab";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          TestingFacilityName: {
            [Op.not]: null,
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          TestingFacilityName: {
            [Op.not]: null,
          },
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [col("TestingFacilityName"), "lab"],
        [global.total, "total"],
        [global.male_suppressed, "male_suppressed"],
        [global.female_suppressed, "female_suppressed"],
        [global.male_not_suppressed, "male_not_suppressed"],
        [global.female_not_suppressed, "female_not_suppressed"],
      ],
      where: where,
      group: [col("TestingFacilityName")],
      order: [[col("TestingFacilityName"), "ASC"]],
    });
    return res.json(data);
  },

  async getSamplesTestedByAge(req, res) {
    const id = "lab_samples_tested_by_age";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          AgeInYears: {
            [Op.between]: req.query.age || age,
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          AgeInYears: {
            [Op.between]: req.query.age || age,
          },
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [fn("year", col("AnalysisDatetime")), "year"],
        [fn("month", col("AnalysisDatetime")), "month"],
        [
          fn("datename", literal("month"), col("AnalysisDatetime")),
          "month_name",
        ],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: where,
      group: [
        fn("year", col("AnalysisDatetime")),
        fn("month", col("AnalysisDatetime")),
        fn("datename", literal("month"), col("AnalysisDatetime")),
      ],
      order: [
        [fn("year", col("AnalysisDatetime")), "ASC"],
        [fn("month", col("AnalysisDatetime")), "ASC"],
      ],
    });
    return res.json(data);
  },

  async getSamplesTestedByPregnancy(req, res) {
    const id = "lab_samples_tested_by_pregnancy";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          Pregnant: {
            [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          Pregnant: {
            [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
          },
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [fn("year", col("AnalysisDatetime")), "year"],
        [fn("month", col("AnalysisDatetime")), "month"],
        [
          fn("datename", literal("month"), col("AnalysisDatetime")),
          "month_name",
        ],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: where,
      group: [
        fn("year", col("AnalysisDatetime")),
        fn("month", col("AnalysisDatetime")),
        fn("datename", literal("month"), col("AnalysisDatetime")),
      ],
      order: [
        [fn("year", col("AnalysisDatetime")), "ASC"],
        [fn("month", col("AnalysisDatetime")), "ASC"],
      ],
    });
    return res.json(data);
  },

  async getSamplesTestedForBreastfeeding(req, res) {
    const id = "lab_samples_tested_breastfeeding";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          Breastfeeding: {
            [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          Breastfeeding: {
            [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
          },
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [fn("year", col("AnalysisDatetime")), "year"],
        [fn("month", col("AnalysisDatetime")), "month"],
        [
          fn("datename", literal("month"), col("AnalysisDatetime")),
          "month_name",
        ],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: where,
      group: [
        fn("year", col("AnalysisDatetime")),
        fn("month", col("AnalysisDatetime")),
        fn("datename", literal("month"), col("AnalysisDatetime")),
      ],
      order: [
        [fn("year", col("AnalysisDatetime")), "ASC"],
        [fn("month", col("AnalysisDatetime")), "ASC"],
      ],
    });
    return res.json(data);
  },
};

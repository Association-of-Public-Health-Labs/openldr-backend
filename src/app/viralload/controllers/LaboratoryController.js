const samples = require("./indicators/samples");
const sequelize = require("sequelize");
const global = require("./indicators/global");
const utils = require("./indicators/utils");
const VlData = require("../models/VlData");
const SamplesBacklog = require("../models/SamplesBacklog");
const SamplesRegistered = require("../models/SamplesRegistered");
const SamplesTested = require("../models/SamplesTested");
const SamplesNonValidated = require("../models/SamplesNonValidated");
const VlWeeklyReport = require("../models/VLWeeklyReport");
const { Op, fn, literal, col } = sequelize;
const moment = require("moment");
const { vldata } = require("../../../config/sequelize")

const dates = [
  moment().subtract(1, "years").format("YYYY-MM-DD"),
  moment().format("YYYY-MM-DD"),
];

const age = [15, 49];

module.exports = {
  async getSamplesByTestReason(req, res) {
    const id = "lab_samples_by_test_reason";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }

    const data = await samples.accumulative(
      [
        {
          ...(req.query.codes && {
            TestingFacilityCode: {
              [Op.in]: req.query.codes,
            },
          }),
          ...(!req.query.codes && {
            TestingFacilityCode: {
              [Op.like]: "P%"
            },
          }),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ],
      [
        [sequelize.fn("count", sequelize.literal("1")), "total"],
        [global.routine, "routine"],
        [global.treatment_failure, "treatment_failure"],
        [global.reason_not_specified, "reason_not_specified"],
      ]
    );

    return res.json(data);
  },

  async getSamplesTestedByMonth(req, res) {
    const id = "lab_samples_tested_by_month";
    // console.log(req.query);
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
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
      where: [
        {
          ...(req.query.codes && {
            TestingFacilityCode: {
              [Op.in]: req.query.codes,
            },
          }),
          // TestingFacilityCode: {
          //   [Op.like]: "P%"
          // },
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ],
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
    // console.log(res.json(data));
    return res.json(data);
  },

  async getSamplesTestedByLab(req, res) {
    const id = "lab_samples_tested_by_lab";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }

    const data = await VlData.findAll({
      attributes: [
        [col("TestingFacilityName"), "lab"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: [
        {
          ...(req.query.codes && {
            TestingFacilityCode: {
              [Op.in]: req.query.codes,
            },
          }),
          ...(!req.query.codes && {
            TestingFacilityCode: {
              [Op.like]: "P%"
            },
          }),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          TestingFacilityName: {
            [Op.not]: null,
          },
        },
      ],
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
      where: [
        {
          ...(req.query.codes && {
            TestingFacilityCode: {
              [Op.in]: req.query.codes,
            },
          }),
          ...(!req.query.codes && {
            TestingFacilityCode: {
              [Op.like]: "P%"
            },
          }),
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

    const data = await VlData.findAll({
      attributes: [
        [col("TestingFacilityName"), "lab"],
        [global.collection_reception, "collection_reception"],
        [global.reception_registration, "reception_registration"],
        [global.registration_analysis, "registration_analysis"],
        [global.analysis_validation, "analysis_validation"],
      ],
      where: [
        {
          ...(req.query.codes && {
            TestingFacilityCode: {
              [Op.in]: req.query.codes,
            },
          }),
          ...(!req.query.codes && {
            TestingFacilityCode: {
              [Op.like]: "P%"
            },
          }),
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
      where: [
        {
          ...(req.query.codes && {
            TestingFacilityCode: {
              [Op.in]: req.query.codes,
            },
          }),
          ...(!req.query.codes && {
            TestingFacilityCode: {
              [Op.like]: "P%"
            },
          }),
          AnalysisDatetime: {
            [Op.between]: dates,
          },
        },
      ],
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

    const data = await VlData.findAll({
      attributes: [
        [col("TestingFacilityName"), "lab"],
        [global.total, "total"],
        [global.male_suppressed, "male_suppressed"],
        [global.female_suppressed, "female_suppressed"],
        [global.male_not_suppressed, "male_not_suppressed"],
        [global.female_not_suppressed, "female_not_suppressed"],
      ],
      where: [
        {
          ...(req.query.codes && {
            TestingFacilityCode: {
              [Op.in]: req.query.codes,
            },
          }),
          ...(!req.query.codes && {
            TestingFacilityCode: {
              [Op.like]: "P%"
            },
          }),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          TestingFacilityName: {
            [Op.not]: null,
          },
        },
      ],
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
      where: [
        {
          ...(req.query.codes && {
            TestingFacilityCode: {
              [Op.in]: req.query.codes,
            },
          }),
          ...(!req.query.codes && {
            TestingFacilityCode: {
              [Op.like]: "P%"
            },
          }),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          AgeInYears: {
            [Op.between]: req.query.age || age,
          },
        },
      ],
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
      where: [
        {
          ...(req.query.codes && {
            TestingFacilityCode: {
              [Op.in]: req.query.codes,
            },
          }),
          ...(!req.query.codes && {
            TestingFacilityCode: {
              [Op.like]: "P%"
            },
          }),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          Pregnant: {
            [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
          },
        },
      ],
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
      where: [
        {
          ...(req.query.codes && {
            TestingFacilityCode: {
              [Op.in]: req.query.codes,
            },
          }),
          ...(!req.query.codes && {
            TestingFacilityCode: {
              [Op.like]: "P%"
            },
          }),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          Breastfeeding: {
            [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
          },
        },
      ],
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


  async getSamplesRejectedByMonth(req, res) {
    const id = "lab_samples_rejected_by_month";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }

    const _dates = req.query.dates || dates;
    const codes = req.query.codes || []

    const data = await VlData.findAll({
      attributes: [
        [fn("year", col("RegisteredDatetime")), "year"],
        [fn("month", col("RegisteredDatetime")), "month"],
        [
          fn("datename", literal("month"), col("RegisteredDatetime")),
          "month_name",
        ],
        [literal("COUNT(1)"), "rejected"],
      ],
      where: literal(`${codes.length > 0 ? `SUBSTRING(RequestID,7,3) IN ('` + codes.join(`','`) + `') AND ` : ''}((LIMSRejectionCode IS NOT NULL AND LIMSRejectionCode <> '')
      OR (HIVVL_LIMSRejectionCode IS NOT NULL AND HIVVL_LIMSRejectionCode <> '')) 
      AND CAST(RegisteredDateTime AS DATE) >= '${_dates[0]}' AND CAST(RegisteredDateTime AS DATE) <= '${_dates[1]}'`),
      group: [
        fn("year", col("RegisteredDatetime")),
        fn("month", col("RegisteredDatetime")),
        fn("datename", literal("month"), col("RegisteredDatetime")),
      ],
      order: [
        [fn("year", col("RegisteredDatetime")), "ASC"],
        [fn("month", col("RegisteredDatetime")), "ASC"],
      ],
    });
    return res.json(data);
  },


  async getRejectedSamples(req, res) {
    const id = "lab_samples_rejected_by_lab";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    const _dates = req.query.dates || dates

    const codes = req.query.codes || []

    const rejections = await vldata.query(`
    SELECT lab.LabName, COUNT(1) rejected FROM ViralLoadData.dbo.VlData AS vl
    JOIN OpenLDRDict.dbo.Laboratories AS lab ON 
    lab.LabCode = SUBSTRING(vl.RequestID,7,3)
    WHERE ((LIMSRejectionCode IS NOT NULL AND LIMSRejectionCode <> '')
    OR (HIVVL_LIMSRejectionCode IS NOT NULL AND HIVVL_LIMSRejectionCode <> '')) AND
    CAST(RegisteredDateTime AS DATE) >= '${_dates[0]}' AND CAST(RegisteredDateTime AS DATE) <= '${_dates[1]}'
    AND lab.LabName <> '' AND lab.LabName IS NOT NULL 
    ${codes.length > 0 ? ` AND lab.LabCode IN ('` + codes.join(`','`) + `')` : ''}
    GROUP BY lab.LabName ORDER BY lab.LabName`
    );

    return res.json(rejections[0])
  },

  async getBacklogs(req, res) {
    const id = "lab_samples_backlogs_by_lab";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    const startDate = moment().subtract(16, "week").format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
    const _dates = req.query.dates || [startDate, endDate];

    const codes = req.query.codes || [];

    const data = await VlWeeklyReport.findAll({
      attributes: [
        [literal('ROW_NUMBER() OVER(PARTITION BY YEAR(start_date), MONTH(start_date) ORDER BY start_date)'), "week_number"],
        [literal('DATENAME(MONTH, start_date)'), "month"],
        [col('Week'), "week"],
        [col('start_date'), "start"],
        [col('end_date'), "end"],
        [fn("sum", col("backlogs")), "backlogs"],
        [fn("sum", col("tests")), "tests"],
        [fn("sum", col("registered")), "registrations"],
        [fn("sum", col("rejected")), "rejections"],
        [fn("sum", col("capacity")), "capacity"],
        [fn("avg", col("tat")), "tat"],
      ],
      where: [
        literal(`CAST(start_date as date) >= '${_dates[0]}' AND CAST(start_date as date) <= '${_dates[1]}'`),
        {
          ...(req.query.codes && {
            LabCode: {
              [Op.in]: req.query.codes,
            },
          }),
        }],
      group: [
        literal('DATENAME(MONTH, start_date)'),
        col('Week'),
        col('start_date'),
        col('end_date')
      ],
      order: [
        [col("start_date"), "ASC"]
      ]
    });

    res.json(data)
  },

  async samples_weekly_resume_by_lab(req, res) {
    const id = "lab_samples_weekly_resume";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var curr = new Date;
    var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
    var dates = req.query.dates || [firstday, lastday];

    const data = await VlWeeklyReport.findAll({
      attributes: [
        [col("labcode"), "labcode"],
        [col("labname"), "labname"],
        [col('week'), "week"],
        [col('start_date'), "start"],
        [col('end_date'), "end"],
        [fn("sum", col("backlogs")), "backlogs"],
        [fn("sum", col("tests")), "tests"],
        [fn("sum", col("registered")), "registrations"],
        [fn("sum", col("rejected")), "rejections"],
        [fn("sum", col("capacity")), "capacity"],
        [fn("avg", col("tat")), "tat"],
      ],
      where: [
        literal(`CAST(start_date as date) >= '${moment(dates[0]).format("YYYY-MM-DD")}' AND CAST(start_date as date) <= '${moment(dates[1]).format("YYYY-MM-DD")}'`),
        {
          ...(req.query.codes && {
            labcode: {
              [Op.in]: req.query.codes,
            },
          }),
        }],
      group: [
        col("labcode"),
        col("labname"),
        col('week'),
        col('start_date'),
        col('end_date'),
      ],
      order: [
        [col("start_date"), "ASC"]
      ]
    });

    return res.json(data)
  },

  async samples_weekly_resume(req, res) {
    const id = "lab_samples_weekly_resume_national";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }

    var firstday = moment().subtract(12, "weeks").format("YYYY-MM-DD");
    var lastday = moment().format("YYYY-MM-DD");
    var dates = req.query.dates || [firstday, lastday];

    const data = await VlWeeklyReport.findAll({
      attributes: [
        [col('week'), "week"],
        [col('start_date'), "start"],
        [col('end_date'), "end"],
        [fn("sum", col("backlogs")), "backlogs"],
        [fn("sum", col("tests")), "tests"],
        [fn("sum", col("registered")), "registrations"],
        [fn("sum", col("rejected")), "rejections"],
        [fn("sum", col("capacity")), "capacity"],
        [fn("avg", col("tat")), "tat"],
      ],
      where: [
        literal(`CAST(start_date as date) >= '${moment(dates[0]).format("YYYY-MM-DD")}' AND CAST(start_date as date) <= '${moment(dates[1]).format("YYYY-MM-DD")}'`),
        {
          ...(req.query.codes && {
            labcode: {
              [Op.in]: req.query.codes,
            },
          }),
        }],
      group: [
        col('week'),
        col('start_date'),
        col('end_date'),
      ],
      order: [
        [col("start_date"), "ASC"]
      ]
    });

    return res.json(data)
  }

};

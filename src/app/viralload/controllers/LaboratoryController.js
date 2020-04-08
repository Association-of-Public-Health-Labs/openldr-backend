const samples = require("./indicators/samples");
const sequelize = require("sequelize");
const global = require("./indicators/global");
const VlData = require("../models/VlData");
const { Op, fn, literal, col } = sequelize;

module.exports = {
  async getSamplesByTestReason(req, res) {
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
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
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: where,
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
        [global.month_name, "ASC"],
      ],
    });
    return res.json(data);
  },

  async getSamplesTestedByLab(req, res) {
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
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
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
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
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
        },
      ];
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
      where: where,
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
        [global.month_name, "ASC"],
      ],
    });
    res.json(data);
  },

  async getTurnaroundTimeByLab(req, res) {
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
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
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
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
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.total, "total"],
        [global.male_suppressed, "male_suppressed"],
        [global.female_suppressed, "female_suppressed"],
        [global.male_not_suppressed, "male_not_suppressed"],
        [global.female_not_suppressed, "female_not_suppressed"],
      ],
      where: where,
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
        [global.month_name, "ASC"],
      ],
    });
    return res.json(data);
  },

  async getSamplesTestedByGenderAndLab(req, res) {
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
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
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
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
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
          AgeInYears: {
            [Op.between]: req.query.age,
          },
        },
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes,
          },
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
          AgeInYears: {
            [Op.between]: req.query.age,
          },
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: where,
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
        [global.month_name, "ASC"],
      ],
    });
    return res.json(data);
  },

  async getSamplesTestedByPregnancy(req, res) {
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
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
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
          Pregnant: {
            [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
          },
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: where,
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
        [global.month_name, "ASC"],
      ],
    });
    return res.json(data);
  },

  async getSamplesTestedForBreastfeeding(req, res) {
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
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
          RegisteredDatetime: {
            [Op.between]: req.query.dates,
          },
          Breastfeeding: {
            [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
          },
        },
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: where,
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
        [global.month_name, "ASC"],
      ],
    });
    return res.json(data);
  },
};

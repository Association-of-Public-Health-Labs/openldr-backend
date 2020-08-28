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

const type = "province";

// const dates = ["2019-08-27", "2020-08-27"];

// const age = [15, 49];

module.exports = ClinicController = {
  async getSamplesByTestReason(req, res) {
    const id = "clinic_samples_by_test_reason";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [{}];
    where[0]["AnalysisDatetime"] = {
      [Op.between]: req.query.dates || dates,
    };
    if (typeof req.query.codes !== "undefined") {
      if ((req.query.type || type) === "province") {
        where[0]["RequestingProvinceName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "district") {
        where[0]["RequestingDistrictName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "clinic") {
        where[0]["RequestingFacilityName"] = {
          [Op.in]: req.query.codes,
        };
      }
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
    const id = "clinic_samples_tested_by_month";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [{}];
    where[0]["AnalysisDatetime"] = {
      [Op.between]: req.query.dates || dates,
    };
    if (typeof req.query.codes !== "undefined") {
      if ((req.query.type || type) === "province") {
        where[0]["RequestingProvinceName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "district") {
        where[0]["RequestingDistrictName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "clinic") {
        where[0]["RequestingFacilityName"] = {
          [Op.in]: req.query.codes,
        };
      }
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

  async getSamplesTestedByFacility(req, res) {
    const id = "clinic_samples_tested_by_facility";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [{}];
    where[0]["AnalysisDatetime"] = {
      [Op.between]: req.query.dates || dates,
    };
    if (typeof req.query.codes !== "undefined") {
      if ((req.query.type || type) === "province") {
        where[0]["RequestingProvinceName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "district") {
        where[0]["RequestingDistrictName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "clinic") {
        where[0]["RequestingFacilityName"] = {
          [Op.in]: req.query.codes,
        };
      }
    }
    const column = await utils.getAttributes(req.query.type || type);
    const data = await VlData.findAll({
      attributes: [
        [column, "facility"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: where,
      group: [column],
      order: [[column, "ASC"]],
    });
    return res.json(data);
  },

  async getTurnaroundTimeByMonth(req, res) {
    const id = "clinic_tat_by_month";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [{}];
    where[0]["AnalysisDatetime"] = {
      [Op.between]: req.query.dates || dates,
    };

    where.push([
      {
        [Op.between]: sequelize.where(
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
    ]);

    if (typeof req.query.codes !== "undefined") {
      if ((req.query.type || type) === "province") {
        where[0]["RequestingProvinceName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "district") {
        where[0]["RequestingDistrictName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "clinic") {
        where[0]["RequestingFacilityName"] = {
          [Op.in]: req.query.codes,
        };
      }
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

  async getTurnaroundTimeByFacility(req, res) {
    const id = "clinic_tat_by_facility";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [{}];
    where[0]["AnalysisDatetime"] = {
      [Op.between]: req.query.dates || dates,
    };

    where.push([
      {
        [Op.between]: sequelize.where(
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
    ]);

    if (typeof req.query.codes !== "undefined") {
      if ((req.query.type || type) === "province") {
        where[0]["RequestingProvinceName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "district") {
        where[0]["RequestingDistrictName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "clinic") {
        where[0]["RequestingFacilityName"] = {
          [Op.in]: req.query.codes,
        };
      }
    }
    const column = await utils.getAttributes(req.query.type || type);
    const data = await VlData.findAll({
      attributes: [
        [column, "facility"],
        [global.collection_reception, "collection_reception"],
        [global.reception_registration, "reception_registration"],
        [global.registration_analysis, "registration_analysis"],
        [global.analysis_validation, "analysis_validation"],
      ],
      where: where,
      group: [column],
      order: [[column, "ASC"]],
    });
    res.json(data);
  },

  async getSamplesTestedByGender(req, res) {
    const id = "clinic_samples_tested_by_gender_monthly";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [{}];
    where[0]["AnalysisDatetime"] = {
      [Op.between]: req.query.dates || dates,
    };
    if (typeof req.query.codes !== "undefined") {
      if ((req.query.type || type) === "province") {
        where[0]["RequestingProvinceName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "district") {
        where[0]["RequestingDistrictName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "clinic") {
        where[0]["RequestingFacilityName"] = {
          [Op.in]: req.query.codes,
        };
      }
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

  async getSamplesTestedByGenderAndFacility(req, res) {
    const id = "clinic_samples_tested_by_gender_and_facility";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [{}];
    where[0]["AnalysisDatetime"] = {
      [Op.between]: req.query.dates || dates,
    };
    if (typeof req.query.codes !== "undefined") {
      if ((req.query.type || type) === "province") {
        where[0]["RequestingProvinceName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "district") {
        where[0]["RequestingDistrictName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "clinic") {
        where[0]["RequestingFacilityName"] = {
          [Op.in]: req.query.codes,
        };
      }
    }
    const column = await utils.getAttributes(req.query.type || type);
    const data = await VlData.findAll({
      attributes: [
        [column, "facility"],
        [global.total, "total"],
        [global.male_suppressed, "male_suppressed"],
        [global.female_suppressed, "female_suppressed"],
        [global.male_not_suppressed, "male_not_suppressed"],
        [global.female_not_suppressed, "female_not_suppressed"],
      ],
      where: where,
      group: [column],
      order: [[column, "ASC"]],
    });
    return res.json(data);
  },

  async getSamplesTestedByAge(req, res) {
    const id = "clinic_samples_tested_by_age";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [{}];
    where[0]["AnalysisDatetime"] = {
      [Op.between]: req.query.dates || dates,
    };
    where[0]["AgeInYears"] = {
      [Op.between]: req.query.age || age,
    };
    if (typeof req.query.codes !== "undefined") {
      if ((req.query.type || type) === "province") {
        where[0]["RequestingProvinceName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "district") {
        where[0]["RequestingDistrictName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "clinic") {
        where[0]["RequestingFacilityName"] = {
          [Op.in]: req.query.codes,
        };
      }
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
    const id = "clinic_samples_tested_by_pregnancy";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [{}];
    where[0]["AnalysisDatetime"] = {
      [Op.between]: req.query.dates || dates,
    };
    where[0]["Pregnant"] = {
      [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
    };
    if (typeof req.query.codes !== "undefined") {
      if ((req.query.type || type) === "province") {
        where[0]["RequestingProvinceName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "district") {
        where[0]["RequestingDistrictName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "clinic") {
        where[0]["RequestingFacilityName"] = {
          [Op.in]: req.query.codes,
        };
      }
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
    const id = "clinic_samples_tested_breastfeeding";
    const cache = await utils.checkCache(req.query, id);
    if (cache) {
      return res.json(cache);
    }
    var where = [{}];
    where[0]["AnalysisDatetime"] = {
      [Op.between]: req.query.dates || dates,
    };
    where[0]["Breastfeeding"] = {
      [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
    };
    if (typeof req.query.codes !== "undefined") {
      if ((req.query.type || type) === "province") {
        where[0]["RequestingProvinceName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "district") {
        where[0]["RequestingDistrictName"] = {
          [Op.in]: req.query.codes,
        };
      } else if ((req.query.type || type) === "clinic") {
        where[0]["RequestingFacilityName"] = {
          [Op.in]: req.query.codes,
        };
      }
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

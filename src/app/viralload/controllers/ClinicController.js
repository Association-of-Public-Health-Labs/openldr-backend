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

// const dates = [
//   "2020-03-01", "2021-03-30"
// ];

const age = [15, 49];

module.exports = ClinicController = {
  async getSamplesByTestReason(req, res) {
    const id = "clinic_samples_by_test_reason";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

    const data = await samples.accumulative(
      [
        {
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })),
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
    const id = "clinic_samples_tested_by_month";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: [
        {
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ],
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
    const disaggregation = req.query.disaggregation === "true";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

    const columnsDetails = await utils.getAttributes(
      req.query.type || type,
      disaggregation
    );
    const data = await VlData.findAll({
      attributes: [
        [columnsDetails.column, "facility"],
        [literal(`'${columnsDetails.type}'`), "type"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: [
        {
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ],
      group: [columnsDetails.column],
      order: [[columnsDetails.column, "ASC"]],
    });
    return res.json(data);
  },

  async getTurnaroundTimeByMonth(req, res) {
    const id = "clinic_tat_by_month";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

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
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                }))
          ,
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
        [global.month_name, "ASC"],
      ],
    });
    res.json(data);
  },

  async getTurnaroundTimeByFacility(req, res) {
    const id = "clinic_tat_by_facility";
    const disaggregation = req.query.disaggregation === "true";

    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

    const columnsDetails = await utils.getAttributes(
      req.query.type || type,
      disaggregation
    );

    const data = await VlData.findAll({
      attributes: [
        [columnsDetails.column, "facility"],
        [literal(`'${columnsDetails.type}'`), "type"],
        [global.collection_reception, "collection_reception"],
        [global.reception_registration, "reception_registration"],
        [global.registration_analysis, "registration_analysis"],
        [global.analysis_validation, "analysis_validation"],
      ],
      where: [
        {
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })),
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
      group: [columnsDetails.column],
      order: [[columnsDetails.column, "ASC"]],
    });
    res.json(data);
  },

  async getSamplesTestedByGender(req, res) {
    const id = "clinic_samples_tested_by_gender_monthly";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

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
      where: [
        {
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ],
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
    const disaggregation = req.query.disaggregation === "true";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

    const columnsDetails = await utils.getAttributes(
      req.query.type || type,
      disaggregation
    );

    const data = await VlData.findAll({
      attributes: [
        [columnsDetails.column, "facility"],
        [literal(`'${columnsDetails.type}'`), "type"],
        [global.total, "total"],
        [global.male_suppressed, "male_suppressed"],
        [global.female_suppressed, "female_suppressed"],
        [global.male_not_suppressed, "male_not_suppressed"],
        [global.female_not_suppressed, "female_not_suppressed"],
      ],
      where: [
        {
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ],
      group: [columnsDetails.column],
      order: [[columnsDetails.column, "ASC"]],
    });
    return res.json(data);
  },

  async getSamplesTestedByAge(req, res) {
    const id = "clinic_samples_tested_by_age";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: [
        {
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          AgeInYears: {
            [Op.between]: req.query.age || age,
          },
        },
      ],
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
        [global.month_name, "ASC"],
      ],
    });
    return res.json(data);
  },

  async getSamplesTestedByAgeAndFacility(req, res) {
    const id = "clinic_samples_tested_by_age_and_facility";
    const disaggregation = req.query.disaggregation === "true";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

    const columnsDetails = await utils.getAttributes(
      req.query.type || type,
      disaggregation
    );

    const data = await VlData.findAll({
      attributes: [
        [columnsDetails.column, "facility"],
        [literal(`'${columnsDetails.type}'`), "type"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: [
        {
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          AgeInYears: {
            [Op.between]: req.query.age || age,
          },
        },
      ],
      group: [columnsDetails.column],
      order: [[columnsDetails.column, "ASC"]],
    });
    return res.json(data);
  },

  async getSamplesTestedByPregnancy(req, res) {
    const id = "clinic_samples_tested_by_pregnancy";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: [
        {
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          Pregnant: {
            [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
          },
        },
      ],
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
        [global.month_name, "ASC"],
      ],
    });
    return res.json(data);
  },

  async getSamplesTestedByPregnancyAndFacility(req, res) {
    const id = "clinic_samples_tested_by_pregnancy_and_facility";
    const disaggregation = req.query.disaggregation === "true";
    const cache = await utils.checkCache(req.query, id);
    
    if (cache) {
      return res.json(cache);
    }

    const columnsDetails = await utils.getAttributes(
      req.query.type || type,
      disaggregation
    );

    const data = await VlData.findAll({
      attributes: [
        [columnsDetails.column, "facility"],
        [literal(`'${columnsDetails.type}'`), "type"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: [
        {
          ...(req.query.codes ?
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })
            : {
              RequestingProvinceName: { [Op.not]: null },
            }   
          ),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          Pregnant: {
            [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
          },
        },
      ],
      group: [columnsDetails.column],
      order: [[columnsDetails.column, "ASC"]],
    });
    return res.json(data);
  },

  async getSamplesTestedForBreastfeeding(req, res) {
    const id = "clinic_samples_tested_breastfeeding";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: [
        {
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          Breastfeeding: {
            [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
          },
        },
      ],
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
        [global.month_name, "ASC"],
      ],
    });
    return res.json(data);
  },

  async getSamplesTestedByBreastfeedingAndFacility(req, res) {
    console.log("disaggregation", req.query.disaggregation)
    const id = "clinic_samples_tested_breastfeeding_and_facility";
    const disaggregation = req.query.disaggregation === "true";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

    const columnsDetails = await utils.getAttributes(
      req.query.type || type,
      disaggregation
    );


    const data = await VlData.findAll({
      attributes: [
        [columnsDetails.column, "facility"],
        [literal(`'${columnsDetails.type}'`), "type"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"],
      ],
      where: [
        {
          ...(req.query.codes ?
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })
            : {
              RequestingProvinceName: { [Op.not]: null },
            }   
          ),
          AnalysisDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          Breastfeeding: {
            [Op.in]: ["YES", "Yes", "yes", "Sim", "SIM"],
          },
        },
      ],
      group: [columnsDetails.column],
      order: [[columnsDetails.column, "ASC"]],
    });
    return res.json(data);
  },

  async getRegisteredSamplesByFacility(req, res) {
    const id = "clinic_registered_samples_by_facility";
    const disaggregation = req.query.disaggregation === "true";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

    const columnsDetails = await utils.getAttributes(
      req.query.type || type,
      disaggregation
    );
    const data = await VlData.findAll({
      attributes: [
        [columnsDetails.column, "facility"],
        [literal(`'${columnsDetails.type}'`), "type"],
        [global.total, "total"],
      ],
      where: [
        {
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })),
          RegisteredDatetime: {
            [Op.between]: req.query.dates || dates,
          },
        },
      ],
      group: [columnsDetails.column],
      order: [[columnsDetails.column, "ASC"]],
    });
    return res.json(data);
  },

  async getSamplesRejectedByMonth(req, res) {
    const id = "clinic_samples_rejected_by_month";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

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
      where: [{
        ...(req.query.codes &&
          ((req.query.type || type) === "province"
            ? {
                RequestingProvinceName: { [Op.in]: req.query.codes },
              }
            : (req.query.type || type) === "district"
            ? {
                RequestingDistrictName: { [Op.in]: req.query.codes },
              }
            : {
                RequestingFacilityName: { [Op.in]: req.query.codes },
        })),
        HIVVL_LIMSRejectionCode: {
          [Op.notLike]: ''
        },
        LIMSRejectionCode: {
          [Op.notLike]: ''
        },
        RegisteredDatetime: {
          [Op.between]: req.query.dates || dates,
        },
      }],
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

  async getSamplesRejectedByFacility(req, res) {
    const id = "clinic_samples_rejected_by_facility";
    const disaggregation = req.query.disaggregation === "true";
    // const cache = await utils.checkCache(req.query, id);
    // if (cache) {
    //   return res.json(cache);
    // }

    const columnsDetails = await utils.getAttributes(
      req.query.type || type,
      disaggregation
    );
    const data = await VlData.findAll({
      attributes: [
        [columnsDetails.column, "facility"],
        [literal(`'${columnsDetails.type}'`), "type"],
        [global.total, "total"],
      ],
      where: [
        {
          ...(req.query.codes &&
            ((req.query.type || type) === "province"
              ? {
                  RequestingProvinceName: { [Op.in]: req.query.codes },
                }
              : (req.query.type || type) === "district"
              ? {
                  RequestingDistrictName: { [Op.in]: req.query.codes },
                }
              : {
                  RequestingFacilityName: { [Op.in]: req.query.codes },
                })),
          RegisteredDatetime: {
            [Op.between]: req.query.dates || dates,
          },
          HIVVL_LIMSRejectionCode: {
            [Op.notLike]: ''
          },
          LIMSRejectionCode: {
            [Op.notLike]: ''
          },
        },
      ],
      group: [columnsDetails.column],
      order: [[columnsDetails.column, "ASC"]],
    });
    return res.json(data);
  },
};

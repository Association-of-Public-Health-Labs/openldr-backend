const ViralLoad = require("../models/VlData");
const { col, literal, fn, Op } = require("sequelize");
const sequelize = require("sequelize");
const moment = require("moment");

module.exports = {
  async index(req, res) {
    const records = await ViralLoad.findAll({
      where: {
        RequestID: {
          [Op.like]: "%" + req.params.requestID,
        },
      },
    });
    return res.json(records);
  },

  async showPacient(req, res) {
    const { fullname } = req.params;
    const names = fullname.split(" ");
    const { docs, pages, total } = await ViralLoad.paginate({
      attributes: [
        "RequestID",
        "FIRSTNAME",
        "SURNAME",
        "AgeInYears",
        "MOBILE",
        "Hl7SexCode",
        "RequestingProvinceName",
        "RequestingDistrictName",
        "RequestingFacilityName",
        "SpecimenDatetime",
        [fn("CAST", literal(`SpecimenDatetime AS date`)), "SpecimenDatetime"],
        [fn("CAST", literal(`ReceivedDatetime AS date`)), "ReceivedDatetime"],
        [
          fn("CAST", literal(`RegisteredDatetime AS date`)),
          "RegisteredDatetime",
        ],
        [fn("CAST", literal(`AnalysisDatetime AS date`)), "AnalysisDatetime"],
        [
          fn("CAST", literal(`AuthorisedDatetime AS date`)),
          "AuthorisedDatetime",
        ],
        "NATIONALID",
        "UNIQUEID",
        "TELHOME",
        "TELWORK",
        "MOBILE",
        "EMAIL",
        "DOB",
        "LIMSRejectionCode",
        "LIMSRejectionDesc",
        "HIVVL_AuthorisedDateTime",
        "HIVVL_LIMSRejectionCode",
        "HIVVL_LIMSRejectionDesc",
        "HIVVL_VRLogValue",
        "ViralLoadResultCategory",
        "HIVVL_ViralLoadResult",
        "HIVVL_ViralLoadCAPCTM",
        "ReasonForTest",
      ],
      where: {
        [Op.and]: {
          firstname: {
            [Op.like]: "%" + names[0] + "%",
          },
          surname: {
            [Op.like]: "%" + names[1] + "%",
          },
        },
      },
      page: req.params.page, // Default 1
      paginate: parseInt(req.params.paginate),
    });

    return res.json({ docs, pages, total, page: parseInt(req.params.page) });
  },

  async paginate(req, res) {
    const { docs, pages, total } = await ViralLoad.paginate({
      attributes: [
        "RequestID",
        "FIRSTNAME",
        "SURNAME",
        "AgeInYears",
        "MOBILE",
        "Hl7SexCode",
        "RequestingProvinceName",
        "RequestingDistrictName",
        "RequestingFacilityName",
        "SpecimenDatetime",
        [fn("CAST", literal(`SpecimenDatetime AS date`)), "SpecimenDatetime"],
        [fn("CAST", literal(`ReceivedDatetime AS date`)), "ReceivedDatetime"],
        [
          fn("CAST", literal(`RegisteredDatetime AS date`)),
          "RegisteredDatetime",
        ],
        [fn("CAST", literal(`AnalysisDatetime AS date`)), "AnalysisDatetime"],
        [
          fn("CAST", literal(`AuthorisedDatetime AS date`)),
          "AuthorisedDatetime",
        ],
        "NATIONALID",
        "UNIQUEID",
        "TELHOME",
        "TELWORK",
        "MOBILE",
        "EMAIL",
        "DOB",
        "LIMSRejectionCode",
        "LIMSRejectionDesc",
        "HIVVL_AuthorisedDateTime",
        "HIVVL_LIMSRejectionCode",
        "HIVVL_LIMSRejectionDesc",
        "HIVVL_VRLogValue",
        "ViralLoadResultCategory",
        "HIVVL_ViralLoadResult",
        "HIVVL_ViralLoadCAPCTM",
        "ReasonForTest",
      ],
      where: {
        // AnalysisDateTime: {
        //   [Op.between]: [req.params.start, req.params.end],
        // },
      },
      page: req.params.page, // Default 1
      paginate: parseInt(req.params.paginate),
    });
    return res.json({ docs, pages, total, page: parseInt(req.params.page) });
  },

  async search_patients(req, res) {
    const { name } = req.params;
    const { docs, pages, total } = await ViralLoad.paginate({
      attributes: [
        "RequestID",
        "FIRSTNAME",
        "SURNAME",
        "AgeInYears",
        "MOBILE",
        "Hl7SexCode",
        "RequestingProvinceName",
        "RequestingDistrictName",
        "RequestingFacilityName",
        "SpecimenDatetime",
        [fn("CAST", literal(`SpecimenDatetime AS date`)), "SpecimenDatetime"],
        [fn("CAST", literal(`ReceivedDatetime AS date`)), "ReceivedDatetime"],
        [
          fn("CAST", literal(`RegisteredDatetime AS date`)),
          "RegisteredDatetime",
        ],
        [fn("CAST", literal(`AnalysisDatetime AS date`)), "AnalysisDatetime"],
        [
          fn("CAST", literal(`AuthorisedDatetime AS date`)),
          "AuthorisedDatetime",
        ],
        "NATIONALID",
        "UNIQUEID",
        "TELHOME",
        "TELWORK",
        "MOBILE",
        "EMAIL",
        "DOB",
        "LIMSRejectionCode",
        "LIMSRejectionDesc",
        "HIVVL_AuthorisedDateTime",
        "HIVVL_LIMSRejectionCode",
        "HIVVL_LIMSRejectionDesc",
        "HIVVL_VRLogValue",
        "ViralLoadResultCategory",
        "HIVVL_ViralLoadResult",
        "HIVVL_ViralLoadCAPCTM",
        "ReasonForTest",
      ],
      where: literal(`DIFFERENCE(FIRSTNAME + SURNAME, '${name}') = 4`),
      page: req.params.page, // Default 1
      paginate: parseInt(req.params.paginate),
    });
    return res.json({ docs, pages, total, page: parseInt(req.params.page) });
  },

  async get_patients_by_query(req, res) {
    const { query } = req.params;
    const { docs, pages, total } = await ViralLoad.paginate({
      attributes: [
        "RequestID",
        "FIRSTNAME",
        "SURNAME",
        "AgeInYears",
        "MOBILE",
        "Hl7SexCode",
        "RequestingProvinceName",
        "RequestingDistrictName",
        "RequestingFacilityName",
        "SpecimenDatetime",
        [fn("CAST", literal(`SpecimenDatetime AS date`)), "SpecimenDatetime"],
        [fn("CAST", literal(`ReceivedDatetime AS date`)), "ReceivedDatetime"],
        [
          fn("CAST", literal(`RegisteredDatetime AS date`)),
          "RegisteredDatetime",
        ],
        [fn("CAST", literal(`AnalysisDatetime AS date`)), "AnalysisDatetime"],
        [
          fn("CAST", literal(`AuthorisedDatetime AS date`)),
          "AuthorisedDatetime",
        ],
        "NATIONALID",
        "UNIQUEID",
        "TELHOME",
        "TELWORK",
        "MOBILE",
        "EMAIL",
        "DOB",
        "LIMSRejectionCode",
        "LIMSRejectionDesc",
        "HIVVL_AuthorisedDateTime",
        "HIVVL_LIMSRejectionCode",
        "HIVVL_LIMSRejectionDesc",
        "HIVVL_VRLogValue",
        "ViralLoadResultCategory",
        "HIVVL_ViralLoadResult",
        "HIVVL_ViralLoadCAPCTM",
        "ReasonForTest",
      ],
      where: literal(query),
      page: req.params.page, // Default 1
      paginate: parseInt(req.params.paginate),
    });
    return res.json({ docs, pages, total, page: parseInt(req.params.page) });
  },

};

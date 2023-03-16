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
        "Hl7SexCode",
        "MOBILE",
        "RequestingProvinceName",
        "RequestingDistrictName",
        "RequestingFacilityName",
        [fn("CAST", literal(`SpecimenDatetime AS date`)), "SpecimenDatetime"],
        // [fn("CAST", literal(`ReceivedDatetime AS date`)), "ReceivedDatetime"],
        // [
        //   fn("CAST", literal(`RegisteredDatetime AS date`)),
        //   "RegisteredDatetime",
        // ],
        [fn("CAST", literal(`AnalysisDatetime AS date`)), "AnalysisDatetime"],
        // [
        //   fn("CAST", literal(`AuthorisedDatetime AS date`)),
        //   "AuthorisedDatetime",
        // ],
        // "NATIONALID",
        // "UNIQUEID",
        // "TELHOME",
        // "TELWORK",
        // "MOBILE",
        // "EMAIL",
        // "DOB",
        // "LIMSRejectionCode",
        // "LIMSRejectionDesc",
        // "HIVVL_AuthorisedDateTime",
        // "HIVVL_LIMSRejectionCode",
        // "HIVVL_LIMSRejectionDesc",
        // "HIVVL_VRLogValue",
        "ViralLoadResultCategory",
        // "HIVVL_ViralLoadResult",
        // "HIVVL_ViralLoadCAPCTM",
        // "ReasonForTest",
      ],
      where: literal(query),
      page: req.params.page, // Default 1
      paginate: parseInt(req.params.paginate),
    });
    console.log('Page', req.params.page)
    return res.json({ docs, pages, total, page: parseInt(req.params.page) });
  },


  async get_all_patients_by_query(req, res) {
    const { query } = req.params;
    const patients = await ViralLoad.findAll({
      attributes: [
        // "RequestID",
        "FIRSTNAME",
        "SURNAME",
        [literal(`
          CASE WHEN LEN(HealthcareNo) > 0 AND HealthcareNo IS NOT NULL THEN HealthcareNo
              WHEN LEN(REFNO) > 0 AND REFNO IS NOT NULL THEN REFNO
              WHEN LEN(NATIONALID) > 0 AND NATIONALID IS NOT NULL THEN NATIONALID
              WHEN LEN(UNIQUEID) > 0 AND UNIQUEID IS NOT NULL THEN UNIQUEID
              ELSE HealthcareNo
          END
        `), "NID"],
        "AgeInYears",
        "Hl7SexCode",
        [literal(`
          CASE 
              WHEN LEN(TELHOME) > 0 AND TELHOME IS NOT NULL THEN TELHOME
              WHEN LEN(TELWORK) > 0 AND TELWORK IS NOT NULL THEN TELWORK
              ELSE MOBILE
          END
        `), "MOBILE"],
        "RequestingProvinceName",
        "RequestingDistrictName",
        "RequestingFacilityName",
        [fn("CAST", literal(`SpecimenDatetime AS date`)), "SpecimenDatetime"],
        // [fn("CAST", literal(`ReceivedDatetime AS date`)), "ReceivedDatetime"],
        [fn("CAST", literal(`RegisteredDatetime AS date`)),"RegisteredDatetime"],
        [fn("CAST", literal(`AnalysisDatetime AS date`)), "AnalysisDatetime"],
        [fn("CAST", literal(`AuthorisedDatetime AS date`)),"AuthorisedDatetime"],
        // "HIVVL_ViralLoadResult",
        // "HIVVL_ViralLoadCAPCTM",
        [
          literal(`
            CASE 
              WHEN LEN(FinalViralLoadResult) > 0 THEN FinalViralLoadResult 
              WHEN LEN(HIVVL_ViralLoadResult) > 0 THEN HIVVL_ViralLoadResult
              WHEN LEN(HIVVL_ViralLoadCAPCTM) > 0 THEN HIVVL_ViralLoadCAPCTM
            END`
          ), 
          "FinalViralLoadResult"
        ],
        [literal(`CASE WHEN ViralLoadResultCategory = 'Suppressed' THEN 'CV Suprimida' WHEN ViralLoadResultCategory = 'Not Suppressed' THEN 'CV Não Suprimida' ELSE ViralLoadResultCategory END`), "ViralLoadResultCategory"],
        [literal(`
          CASE 
            WHEN ReasonForTest = 'Routine' THEN 'Rotina' 
            WHEN ReasonForTest IN ('Suspected treatment failure','Suspeita de falha terapêutica') THEN 'Suspeita de falha terapêutica'
            WHEN ReasonForTest IN ('Repeat after breastfeeding','Repetição após AMA') THEN 'Repetição após Aleitamento'
            WHEN ReasonForTest IN ('Não preenchido','Reason Not Specified') THEN 'Motivo Não preenchido'
            ELSE ReasonForTest
          END
        `), "ReasonForTest"]
      ],
      where: literal(query),
    });
    return res.json(patients);
  },

};

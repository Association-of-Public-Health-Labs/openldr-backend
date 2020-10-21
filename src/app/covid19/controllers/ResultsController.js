const Covid19 = require("../models/Covid19");
const { col, literal, fn, Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  async show(req, res) {
    const records = await Covid19.findAll({
      where: { RequestID: "MZDISAPMB0114464" },
    });
    return res.json(records);
  },

  async paginate(req, res) {
    const { docs, pages, total } = await Covid19.paginate({
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
        [
          literal(
            `CASE WHEN COVID19Result IN ('SARS COVID-19 Positivo','SARS-CoV-2 Positivo') THEN 'Positivo' WHEN COVID19Result IN ('Negativo para SARS-CoV-2') THEN 'Negativo' ELSE Covid19Result END`
          ),
          "Covid19Result",
        ],
        "Pat_NATIONALITY",
        "NATIONALID",
        "UNIQUEID",
        "TELHOME",
        "TELWORK",
        "MOBILE",
        "EMAIL",
        "DOB",
        "LIMSRejectionCode",
        "LIMSRejectionDesc",
        "HistoryOfSomeDisease",
        "ArrivalTime",
        "Contact14Days",
        "ContactDate1",
        "ContactDate2",
        "DestinyCountry",
        "LengthOfStayInMoz",
        "EntryPointName",
        "PlaceOfResidenceInMoz",
        "WaitingPoint",
        "Workplace",
        "MeansOfTransport",
        "Nationality",
        "NotificationDate",
        "Number",
        "NumberOfCompanions",
        "Coryza",
        "Country1",
        "Country2",
        "PartcpCeremonies",
        "DepartureDate",
        "CountryOfOrigin",
        "ContactPerson",
        "Provenance",
        "ReasonForTripToMoz",
        "ContactPersonsPhone",
        "Telephone",
        "Traveler",
        "SymptomStartDate",
        "Diarrhea",
        "JoinPain",
        "Headaches",
        "MuscleAches",
        "DurationOfSymptoms",
        "ShortnessOfBreath",
        "Fever",
        "GeneralWeakness",
        "Nausea",
        "Symptoms",
        "Remarks",
        "Vomit",
        "ResultsRemarks",
      ],
      where: {
        AnalysisDateTime: {
          [Op.between]: [req.params.start, req.params.end],
        },
      },
      page: req.params.page, // Default 1
      paginate: parseInt(req.params.paginate),
    });
    return res.json({ docs, pages, total, page: parseInt(req.params.page) });
  },

  async get_patients_with_contacts(req, res) {
    const { start_date, end_date } = req.params;
    const results = await Covid19.findAll({
      attributes: [
        [col("RequestID"), "requestid"],
        [literal(`FIRSTNAME + ' ' + SURNAME`), "fullname"],
        [col("Hl7SexCode"), "Hl7SexCode"],
        [
          literal(
            "IIF(TELWORK = '', IIF(TELHOME = '', MOBILE, TELHOME), TELWORK)"
          ),
          "mobile_1",
        ],
        // [col("TELHOME"), "mobile_1"],
        [(col("MOBILE"), "mobile_2")],
        [col("SpecimenDatetime"), "SpecimenDatetime"],
        [col("AuthorisedDatetime"), "AuthorisedDatetime"],
        [col("RequestingFacilityName"), "RequestingFacilityName"],
        [col("Covid19Result"), "Covid19Result"],
      ],
      where: {
        [Op.and]: [
          literal(
            `CAST(AuthorisedDatetime AS DATE) >= '${start_date}' AND CAST(AuthorisedDatetime AS DATE) <= '${end_date}'`
          ),
          literal(
            `((TELHOME IS NOT NULL AND TELHOME <> '') OR (TELWORK IS NOT NULL AND TELWORK <> '') OR (MOBILE IS NOT NULL AND MOBILE <> ''))`
          ),
          {
            Covid19Result: {
              [Op.like]: "%Negativo%",
            },
            RequestingProvinceName: {
              [Op.in]: ["Maputo Cidade", "Maputo Provincia", "Sofala"]
            },
            // RequestingProvinceName: "Maputo Cidade",
          },
        ],
      },
    });

    return res.json(results);
  },

  async get_patients_sms_status_by_province(req, res) {
    const { start_date, end_date, province } = req.params;
    const results = await Covid19.findAll({
      attributes: [
        [col("RequestID"), "requestid"],
        [col("SURNAME"), "surname"],
        [col("FIRSTNAME"), "firstname"],
        [col("AgeInYears"), "age"],
        [col("Hl7SexCode"), "gender"],
        [col("RequestingProvinceName"), "province"],
        [col("RequestingDistrictName"), "district"],
        [col("RequestingFacilityName"), "clinic"],
        [
          literal(
            "CASE WHEN TELHOME IS NULL OR TELHOME = '' THEN MOBILE ELSE TELHOME END"
          ),
          "mobile_1",
        ],
        [col("MOBILE"), "mobile_2"],
        [col("SpecimenDatetime"), "SpecimenDatetime"],
        [col("AuthorisedDatetime"), "AuthorisedDatetime"],
        [col("Covid19Result"), "Covid19Result"],
        [col("SMS_STATUS"), "status"],
      ],
      where: {
        [Op.and]: [
          literal(
            `CAST(AuthorisedDatetime AS DATE) >= '${start_date}' AND CAST(AuthorisedDatetime AS DATE) <= '${end_date}'`
          ),
          {
            Covid19Result: {
              [Op.like]: "%Negativo%",
            },
            RequestingProvinceName: province,
          },
        ],
      },
    });

    return res.json(results);
  },

  async update_sms_status(req, res) {
    const { requestid, status } = req.params;
    const results = await Covid19.update(
      { SMS_STATUS: status },
      {
        where: {
          RequestID: requestid,
        },
      }
    );

    return res.json(results);
  },

  async search_patients(req, res) {
    const { requestid } = req.params;
    const result = await Covid19.findOne({
      attributes: [
        [col("RequestID"), "requestid"],
        [col("SURNAME"), "surname"],
        [col("FIRSTNAME"), "firstname"],
        [col("AgeInYears"), "age"],
        [col("Hl7SexCode"), "gender"],
        [col("RequestingProvinceName"), "province"],
        [col("RequestingDistrictName"), "district"],
        [col("RequestingFacilityName"), "clinic"],
        [
          literal(
            "CASE WHEN TELHOME IS NULL OR TELHOME = '' THEN MOBILE ELSE TELHOME END"
          ),
          "mobile_1",
        ],
        [col("MOBILE"), "mobile_2"],
        [col("SpecimenDatetime"), "SpecimenDatetime"],
        [col("AuthorisedDatetime"), "AuthorisedDatetime"],
        [col("Covid19Result"), "Covid19Result"],
      ],
      where: literal(`RequestID LIKE '%${requestid}%'`),
    });
    return res.json(result);
  },
};

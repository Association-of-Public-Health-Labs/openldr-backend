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
};

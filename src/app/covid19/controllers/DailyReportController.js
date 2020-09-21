const Covid19 = require("../models/Covid19");
const { col, literal, fn, Op } = require("sequelize");

module.exports = {
  async get_resume(req, res) {
    const { startDate, endDate } = req.params;

    const data = await Covid19.findAll({
      attributes: [
        [
          literal(
            `ISNULL(ISNULL(RequestingProvinceName, RequestingProvinceName), LOCATION)`
          ),
          "RequestingProvinceName",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN CAST(RegisteredDateTime AS DATE) >= '${startDate}' AND CAST(RegisteredDatetime AS DATE) <= '${endDate}' THEN 1 ELSE NULL END`
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
        [
          fn(
            "avg",
            literal(
              `CASE WHEN CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN DATEDIFF(HOUR,SpecimenDatetime, AuthorisedDateTime) ELSE  NULL END`
            )
          ),
          "tat",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN TestingFacilityCode = 'PMB' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "ins",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN TestingFacilityCode = 'PDC' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "dream_beira",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN TestingFacilityCode = 'PBU' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "uem",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN TestingFacilityCode = 'PNV' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "nampula",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN TestingFacilityCode = 'PDD' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "pemba",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN TestingFacilityCode = 'PQM' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "quelimane",
        ],
        [
          fn(
            "count",
            literal(
              `CASE WHEN TestingFacilityCode = 'PTC' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${startDate}' AND CAST(AuthorisedDatetime AS date) <= '${endDate}' THEN 1 ELSE NULL END`
            )
          ),
          "tete",
        ],
      ],
      group: [
        literal(
          `ISNULL(ISNULL(RequestingProvinceName, RequestingProvinceName), LOCATION)`
        ),
      ],
      order: [
        literal(
          `ISNULL(ISNULL(RequestingProvinceName, RequestingProvinceName), LOCATION)`
        ),
      ],
    });

    return res.json(data);
  },

  async reason_for_test_report(req, res) {
    const { start_date, end_date } = req.params;

    const reason = await Covid19.findAll({
      attributes: [
        [literal(`ISNULL(RequestingProvinceName, LOCATION)`), "province"],
        [fn("count", literal(`1`)), "samples_validated"],
        [
          fn(
            "count",
            literal(
              `CASE WHEN ReasonForTest LIKE 'Contacto' THEN 1 ELSE NULL END`
            )
          ),
          "contacto",
        ],
        [
          literal(
            `COUNT(CASE WHEN ReasonForTest LIKE '%Controle Positvdade pós cura%' THEN 1 ELSE NULL END)`
          ),
          "Controle_Positividade_Pos_Cura",
        ],
        [
          literal(
            `COUNT(CASE WHEN ReasonForTest LIKE '%1o Controle de Cura%' THEN 1 ELSE NULL END)`
          ),
          "Primeiro_Contole_de_Cura",
        ],
        [
          literal(
            `COUNT(CASE WHEN ReasonForTest LIKE '%2o Controle de Cura%' THEN 1 ELSE NULL END)`
          ),
          "Segundo_Contole_de_Cura",
        ],
        [
          literal(
            `COUNT(CASE WHEN ReasonForTest LIKE '%Infeccoes Resp. Agudas%' THEN 1 ELSE NULL END)`
          ),
          "infeccoes_respiratorias_agudas",
        ],
        [
          literal(
            `COUNT(CASE WHEN ReasonForTest LIKE '%Testagem de TS com IVRS%' THEN 1 ELSE NULL END)`
          ),
          "testagem_de_ts_com_ivrs",
        ],
        [
          literal(
            `COUNT(CASE WHEN ReasonForTest LIKE '%Nao Preenchido%' THEN 1 ELSE NULL END)`
          ),
          "nao_preenchido",
        ],
        [
          literal(
            `COUNT(CASE WHEN ReasonForTest LIKE '%Viajante com Sintomas%' THEN 1 ELSE NULL END)`
          ),
          "viajante_com_sintomas",
        ],
        [
          literal(
            `COUNT(CASE WHEN ReasonForTest LIKE '%Vigilância das IRAs%' THEN 1 ELSE NULL END)`
          ),
          "vigilancia_das_iras",
        ],
        [
          literal(
            `COUNT(CASE WHEN ReasonForTest LIKE 'Outro' THEN 1 ELSE NULL END)`
          ),
          "others",
        ],
        [
          literal(
            `COUNT(CASE WHEN ReasonForTest IS NULL OR ReasonForTest = '' THEN 1 ELSE NULL END)`
          ),
          "sem_motivo_especificado",
        ],
      ],
      where: literal(
        `CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}'`
      ),

      group: [literal(`ISNULL(RequestingProvinceName, LOCATION)`)],
      order: [literal(`ISNULL(RequestingProvinceName, LOCATION)`)],
    });

    return res.json(reason);
  },

  async get_tat_by_province(req, res) {
    const { start_date, end_date } = req.params;

    const tat = await Covid19.findAll({
      attributes: [
        [literal(`ISNULL(RequestingProvinceName, LOCATION)`), "province"],
        [
          literal(
            `COUNT(CASE WHEN CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`
          ),
          "samples_tested",
        ],
        [
          literal(
            `COUNT(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`
          ),
          "samples_validated",
        ],
        [
          literal(
            `AVG(CASE WHEN DATEDIFF(HOUR, SpecimenDatetime, ReceivedDatetime) >= 0 AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,SpecimenDatetime, ReceivedDatetime) ELSE NULL END)`
          ),
          "collection_to_receive",
        ],
        [
          literal(
            `AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,ReceivedDatetime,RegisteredDateTime) ELSE NULL END)`
          ),
          "receive_to_registration",
        ],
        [
          literal(
            `AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,RegisteredDateTime, AnalysisDateTime) ELSE NULL END)`
          ),
          "registration_to_analysis",
        ],
        [
          literal(
            `AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,AnalysisDateTime, AuthorisedDateTime) ELSE NULL END)`
          ),
          "analysis_to_validation",
        ],
        [
          literal(
            `AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,SpecimenDatetime, AuthorisedDateTime) ELSE  NULL END)`
          ),
          "total",
        ],
      ],
      group: [literal(`ISNULL(RequestingProvinceName, LOCATION)`)],
      order: [literal(`ISNULL(RequestingProvinceName, LOCATION)`)],
    });

    return res.json(tat);
  },

  async get_tat_by_lab(req, res) {
    const { start_date, end_date } = req.params;

    const tat = await Covid19.findAll({
      attributes: [
        [col("TestingFacilityName"), "lab"],
        [
          literal(
            `COUNT(CASE WHEN CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`
          ),
          "samples_tested",
        ],
        [
          literal(
            `COUNT(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`
          ),
          "samples_validated",
        ],
        [
          literal(
            `AVG(CASE WHEN DATEDIFF(HOUR, SpecimenDatetime, ReceivedDatetime) >= 0 AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,SpecimenDatetime, ReceivedDatetime) ELSE NULL END)`
          ),
          "collection_to_receive",
        ],
        [
          literal(
            `AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,ReceivedDatetime,RegisteredDateTime) ELSE NULL END)`
          ),
          "receive_to_registration",
        ],
        [
          literal(
            `AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,RegisteredDateTime, AnalysisDateTime) ELSE NULL END)`
          ),
          "registration_to_analysis",
        ],
        [
          literal(
            `AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,AnalysisDateTime, AuthorisedDateTime) ELSE NULL END)`
          ),
          "analysis_to_validation",
        ],
        [
          literal(
            `AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,SpecimenDatetime, AuthorisedDateTime) ELSE  NULL END)`
          ),
          "total",
        ],
      ],
      group: [col("TestingFacilityName")],
      order: [col("TestingFacilityName")],
    });

    return res.json(tat);
  },

  async get_results(req, res) {
    const { start_date, end_date } = req.params;

    const results = await Covid19.findAll({
      attributes: [
        "RequestID",
        "SURNAME",
        "FIRSTNAME",
        "AgeInYears",
        "Hl7SexCode",
        "RequestingProvinceName",
        "RequestingDistrictName",
        "RequestingFacilityName",
        "MOBILE",
        "SpecimenDatetime",
        "ReceivedDatetime",
        "RegisteredDatetime",
        "AnalysisDatetime",
        "AuthorisedDatetime",
        "COVID19Result",
        "ReasonForTest",
        "ResultLIMSPanelCode",
        "TestingFacilityName",
      ],
      where: literal(
        `CAST(AuthorisedDateTime AS date) >= '${start_date}' AND CAST(AuthorisedDateTime AS date) <= '${end_date}'`
      ),
      order: [
        col("RequestingProvinceName"),
        col("RequestingDistrictName"),
        col("RequestingFacilityName"),
      ],
    });

    return res.json(results);
  },
};

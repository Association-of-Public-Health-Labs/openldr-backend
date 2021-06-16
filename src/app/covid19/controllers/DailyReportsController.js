const { col, literal, fn, Op } = require("sequelize");
const { covid19 } = require("../../../config/sequelize");
const Covid19 = require("../models/Covid19");

module.exports = {
  async getDailyResume(req, res) {
    const {start_date, end_date} = req.params;
    const resume = await Covid19.findAll({
      attributes: [
        [literal("ISNULL(ISNULL(RequestingProvinceName, RequestingProvinceName), LOCATION)"), "RequestingProvinceName"],
        [literal(`COUNT(CASE WHEN CAST(ISNULL(RegisteredDatetime,RegisteredDateTime) AS DATE) = '${end_date}' THEN 1 ELSE NULL END)`), "RegisteredSamples"],
        [literal(`COUNT(CASE WHEN CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "TestedSamples"],
        [literal(`COUNT(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode THEN 1 ELSE NULL END)`), "ValidatedSamples"],
        [literal(`COUNT(CASE WHEN AnalysisDateTime IS NULL AND (LIMSRejectionCode = '' OR LIMSRejectionCode IS NULL) AND DATEDIFF(DAY,RegisteredDateTime, GETDATE()) < 30 AND RequestID NOT LIKE '%PBU%' THEN 1 ELSE NULL END)`), "PendingSamples"],
        [literal(`COUNT(CASE WHEN CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}' AND ((LIMSRejectionCode <> '' AND LIMSRejectionCode IS NOT NULL) OR (LIMSRejectionCode <> '' AND LIMSRejectionCode IS NOT NULL)) THEN 1 ELSE NULL END)`), "RejectedSamples"],
        [literal(`COUNT(CASE WHEN Remarks LIKE '%CONTROL%' AND CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "Control"],
        [literal(`COUNT(CASE WHEN Remarks LIKE '%retesta%' AND CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "Retest"],
        [literal(`null`), "TotalReported"],
        [literal(`COUNT(CASE WHEN COVID19Result IN ('SARS COVID-19 Positivo','SARS-CoV-2 Positivo') AND CAST(AuthorisedDateTime AS date) >= '${start_date}' AND CAST(AuthorisedDateTime AS date) <= '${end_date}' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode THEN 1 ELSE NULL END)`), "Positives"],
        [literal(`AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,SpecimenDatetime, AuthorisedDateTime) ELSE  NULL END)`), "TAT"],
        [literal(`COUNT(CASE WHEN TestingFacilityCode = 'PMB' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "INS"],
        [literal(`COUNT(CASE WHEN TestingFacilityCode = 'PDC' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "DREAM"],
        [literal(`COUNT(CASE WHEN TestingFacilityCode = 'PJC' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "Jose Macamo"],
        [literal(`COUNT(CASE WHEN TestingFacilityCode = 'PNV' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "HCN"],
        [literal(`COUNT(CASE WHEN TestingFacilityCode = 'PDD' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "Pemba"],
        [literal(`COUNT(CASE WHEN TestingFacilityCode = 'PQM' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "Quelimane"],
        [literal(`COUNT(CASE WHEN TestingFacilityCode = 'PTC' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "Tete"],
        [literal(`COUNT(CASE WHEN TestingFacilityCode = 'PIM' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "CISM"],
        [literal(`COUNT(CASE WHEN TestingFacilityCode = 'PCM' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "Chimoio"],
        [literal(`COUNT(CASE WHEN TestingFacilityCode = 'PXA' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "Xai-Xai"],
      ],
      group: [
        literal("ISNULL(ISNULL(RequestingProvinceName, RequestingProvinceName), LOCATION)"),
      ],
      order: [
        literal("ISNULL(ISNULL(RequestingProvinceName, RequestingProvinceName), LOCATION)"),
      ],
    })
    return res.json(resume)
  },

  async getReasonForTestReport(req, res) {
    const {start_date, end_date} = req.params;

    const report = await Covid19.findAll({
      attributes: [
        [literal("ISNULL(ISNULL(RequestingProvinceName, RequestingProvinceName), LOCATION)"), "RequestingProvinceName"],
        [literal("COUNT(1)"), "SamplesValidated"],
        [literal("COUNT(CASE WHEN ReasonForTest LIKE 'Contacto' THEN 1 ELSE NULL END)"), "Contacto"],
        [literal("COUNT(CASE WHEN ReasonForTest LIKE '%Controle Positvdade pós cura%' THEN 1 ELSE NULL END)"), "Controle_Positividade_Pos_Cura"],
        [literal("COUNT(CASE WHEN ReasonForTest LIKE '%1o Controle de Cura%' THEN 1 ELSE NULL END)"), "Primeiro_Contole_de_Cura"],
        [literal("COUNT(CASE WHEN ReasonForTest LIKE '%2o Controle de Cura%' THEN 1 ELSE NULL END)"), "Segundo_Contole_de_Cura"],
        [literal("COUNT(CASE WHEN ReasonForTest LIKE '%Infeccoes Resp. Agudas%' THEN 1 ELSE NULL END)"), "Infeccoes_Respiratorias_Agudas"],
        [literal("COUNT(CASE WHEN ReasonForTest LIKE '%Testagem de TS com IVRS%' THEN 1 ELSE NULL END)"), "Testagem_de_TS_com_IVRS"],
        [literal("COUNT(CASE WHEN ReasonForTest LIKE '%Nao Preenchido%' THEN 1 ELSE NULL END)"), "Nao_Preenchido"],
        [literal("COUNT(CASE WHEN ReasonForTest LIKE '%Viajante com Sintomas%' THEN 1 ELSE NULL END)"), "Viajante_com_Sintomas"],
        [literal("COUNT(CASE WHEN ReasonForTest LIKE '%Vigilância das IRAs%' THEN 1 ELSE NULL END)"), "Vigilancia_das_IRAs"],
        [literal("COUNT(CASE WHEN ReasonForTest LIKE 'Outro' THEN 1 ELSE NULL END)"), "Outro"],
        [literal("COUNT(CASE WHEN ReasonForTest IS NULL OR ReasonForTest = '' THEN 1 ELSE NULL END)"), "Sem_Motivo_Especificado"],
      ],
      where: literal(
        `CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}'`
      ),
      group: [
        literal("ISNULL(ISNULL(RequestingProvinceName, RequestingProvinceName), LOCATION)"),
      ],
      order: [
        literal("ISNULL(ISNULL(RequestingProvinceName, RequestingProvinceName), LOCATION)"),
      ],
    });

    return res.json(report)
  },

  async get_tat_by_province(req, res) {
    const {start_date, end_date} = req.params;

    const report = await Covid19.findAll({
      attributes: [
        [literal(`ISNULL(ISNULL(RequestingProvinceName, RequestingProvinceName), LOCATION)`), "RequestingProvinceName"],
        [literal(`COUNT(CASE WHEN CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "SamplesTested"],
        [literal(`COUNT(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "SamplesValidated"],
        [literal(`AVG(CASE WHEN DATEDIFF(HOUR, SpecimenDatetime, ReceivedDatetime) >= 0 AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,SpecimenDatetime, ReceivedDatetime) ELSE NULL END)`), "collection_to_receive"],
        [literal(`AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,ReceivedDatetime,RegisteredDateTime) ELSE NULL END)`), "receive_to_registration"],
        [literal(`AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,RegisteredDateTime, AnalysisDateTime) ELSE NULL END)`), "registration_to_analysis"],
        [literal(`AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,AnalysisDateTime, AuthorisedDateTime) ELSE NULL END)`), "analysis_to_validation"],
        [literal(`AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,SpecimenDatetime, AuthorisedDateTime) ELSE  NULL END)`), "tat"],
      ],
      where: literal(`SUBSTRING(RequestID,7,3) = TestingFacilityCode AND RequestingProvinceName IS NOT NULL`),
      group: [
        literal("ISNULL(ISNULL(RequestingProvinceName, RequestingProvinceName), LOCATION)"),
      ],
      order: [
        literal("ISNULL(ISNULL(RequestingProvinceName, RequestingProvinceName), LOCATION)"),
      ],
    });

    return res.json(report)
  },

  async get_tat_by_lab(req, res) {
    const {start_date, end_date} = req.params;

    const report = await Covid19.findAll({
      attributes: [
        [col("TestingFacilityName"), "TestingFacilityName"],
        [literal(`COUNT(CASE WHEN CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "SamplesTested"],
        [literal(`COUNT(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN 1 ELSE NULL END)`), "SamplesValidated"],
        [literal(`AVG(CASE WHEN DATEDIFF(HOUR, SpecimenDatetime, ReceivedDatetime) >= 0 AND CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,SpecimenDatetime, ReceivedDatetime) ELSE NULL END)`), "collection_to_receive"],
        [literal(`AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,ReceivedDatetime,RegisteredDateTime) ELSE NULL END)`), "receive_to_registration"],
        [literal(`AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,RegisteredDateTime, AnalysisDateTime) ELSE NULL END)`), "registration_to_analysis"],
        [literal(`AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,AnalysisDateTime, AuthorisedDateTime) ELSE NULL END)`), "analysis_to_validation"],
        [literal(`AVG(CASE WHEN CAST(AuthorisedDatetime AS date) >= '${start_date}' AND CAST(AuthorisedDatetime AS date) <= '${end_date}' THEN DATEDIFF(HOUR,SpecimenDatetime, AuthorisedDateTime) ELSE  NULL END)`), "tat"],
      ],
      where: literal(`SUBSTRING(RequestID,7,3) = TestingFacilityCode AND TestingFacilityName IS NOT NULL`),
      group: [col("TestingFacilityName")],
      order: [col("TestingFacilityName")],
    });

    return res.json(report)
  },

  async getDailyResults(req, res) {
    const {start_date, end_date} = req.params;

    const report = await Covid19.findAll({
      attributes: [
        [col("RequestID"), "RequestID"],
        [col("SURNAME"), "SURNAME"],
        [col("FIRSTNAME"), "FIRSTNAME"],
	      [literal(`ISNULL(AgeInYears, AgeInYears)`), "AgeInYears"],
	      [col("HL7SexCode"), "HL7SexCode"],
        [literal('ISNULL(RequestingProvinceName, RequestingProvinceName)'), "RequestingProvinceName"],
        [literal('ISNULL(RequestingDistrictName, RequestingDistrictName)'), "RequestingDistrictName"],
        [literal('ISNULL(ISNULL(RequestingFacilityName, RequestingFacilityName), LOCATION)'), "RequestingFacilityName"],
        [literal('ISNULL(Telephone, TELHOME)'), "TELHOME"],
        [literal('ISNULL(Telephone, TELWORK)'), "TELWORK"],
        [literal('ISNULL(Telephone, MOBILE)'), "MOBILE"],
        [col("PlaceOfResidenceInMoz"), "PlaceOfResidenceInMoz"],
        [col("Provenance"), "Provenance"],
        [col("Nationality"), "Nationality"],
        [col("Symptoms"), "Symptoms"],
	      [col("SpecimenDatetime"), "SpecimenDatetime"],
        [col("RegisteredDatetime"), "RegisteredDatetime"],
        [col("AnalysisDateTime"), "AnalysisDateTime"],
        [col("AuthorisedDatetime"), "AuthorisedDatetime"],
        [col("COVID19Result"), "COVID19Result"],
        [col("ReasonForTest"), "ReasonForTest"],
        [col("ResultLIMSPanelCode"), "ResultLIMSPanelCode"],
        [col("TestingFacilityName"), "TestingFacilityName"],
      ],
      where: literal(`CAST(AuthorisedDateTime AS date) >= '${start_date}' AND CAST(AuthorisedDateTime AS date) <= '${end_date}' AND SUBSTRING(RequestID,7,3) = TestingFacilityCode`),
      order: [
        literal("ISNULL(RequestingProvinceName, RequestingProvinceName)"),
        literal("ISNULL(RequestingDistrictName, RequestingDistrictName)"),
        literal("ISNULL(ISNULL(RequestingFacilityName, RequestingFacilityName), LOCATION)"),
        col("SURNAME"),
        col("FIRSTNAME")
      ],
    });

    return res.json(report)
  },

  async getDailyPendingResults(req, res) {
    const report = await covid19.query(`
      SELECT 
        RequestID
        ,SURNAME
        ,FIRSTNAME
        ,ISNULL(AgeInYears, AgeInYears) AgeInYears
        ,HL7SexCode
        ,ISNULL(RequestingProvinceName, RequestingProvinceName) RequestingProvinceName
        ,ISNULL(RequestingDistrictName, RequestingDistrictName) RequestingDistrictName
        ,ISNULL(ISNULL(RequestingFacilityName, RequestingFacilityName), LOCATION) RequestingFacilityName
        ,ISNULL(Telephone, TELHOME)
        ,ISNULL(SpecimenDatetime, SpecimenDatetime) SpecimenDatetime
        ,RegisteredDatetime
        ,ReasonForTest
        ,lab.LabName
      FROM Covid19.dbo.Covid19
      LEFT JOIN OpenLDRDict.dbo.Laboratories AS lab ON lab.LabCode = SUBSTRING(RequestID,7,3) 
      WHERE AnalysisDateTime IS NULL AND (LIMSRejectionCode = '' OR LIMSRejectionCode IS NULL) AND RequestID NOT LIKE '%PBU%'
      AND DATEDIFF(DAY,RegisteredDateTime, GETDATE()) < 30
      ORDER BY ISNULL(RequestingProvinceName, RequestingProvinceName) 
        ,ISNULL(RequestingDistrictName, RequestingDistrictName) 
        ,ISNULL(ISNULL(RequestingFacilityName, RequestingFacilityName), LOCATION) 
    `);

    return res.json(report)
  }
}
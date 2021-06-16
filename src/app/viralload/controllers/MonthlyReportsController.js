const {col, literal} = require("sequelize");
const VlData = require("../models/VlData");

module.exports = {
  async getVlReportByAge(req, res){
    const {start_date, end_date} = req.params;
    const report = await VlData.findAll({
      attributes: [
        [col("RequestingProvinceName"), "RequestingProvinceName"],
        [col("RequestingDistrictName"), "RequestingDistrictName"],
        [col("RequestingFacilityName"), "RequestingFacilityName"],
        [col("AgeGroup"), "AgeGroup"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Routine','Rotina'),1,NULL))`), "routine_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed' AND ReasonForTest IN ('Routine','Rotina'),1,NULL))`), "routine_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Suspected treatment failure','Suspeita de falha terapéutica'),1,NULL))`), "stf_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed' AND ReasonForTest IN ('Suspected treatment failure','Suspeita de falha terapéutica'),1,NULL))`), "stf_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Repetição após AMA','Repeat after breastfeeding'),1,NULL))`), "repeat_after_breast_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed'  AND ReasonForTest IN ('Repetição após AMA','Repeat after breastfeeding'),1,NULL))`), "repeat_after_breast_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Reason Not Specified','Não preenchido'),1,NULL))`), "not_specified_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed'  AND ReasonForTest IN ('Reason Not Specified','Não preenchido'),1,NULL))`), "not_specified_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed',1,NULL))`), "suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed',1,NULL))`), "non_suppressed"],
        [literal(`COUNT(1)`), "total"],
      ],
      where: literal(`
        CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}' AND Hl7ResultStatusCode = 'F'
        AND RequestingProvinceName IS NOT NULL AND RequestingDistrictName IS NOT NULL`
        ),
      group: [
        col("RequestingProvinceName"), col("RequestingDistrictName"), col("RequestingFacilityName"), col("AgeGroup")
      ],
      order: [
        col("RequestingProvinceName"), col("RequestingDistrictName"), col("RequestingFacilityName"), col("AgeGroup")
      ]
    })

    return res.json(report)
  },

  async getVlReportByGender(req, res){
    const {start_date, end_date} = req.params;
    const report = await VlData.findAll({
      attributes: [
        [col("RequestingProvinceName"), "RequestingProvinceName"],
        [col("RequestingDistrictName"), "RequestingDistrictName"],
        [col("RequestingFacilityName"), "RequestingFacilityName"],
        [literal("CASE WHEN Hl7SexCode IN ('','I','U') THEN 'Não especificado' ELSE Hl7SexCode END"), "gender"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Routine','Rotina'),1,NULL))`), "routine_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed' AND ReasonForTest IN ('Routine','Rotina'),1,NULL))`), "routine_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Suspected treatment failure','Suspeita de falha terapéutica'),1,NULL))`), "stf_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed' AND ReasonForTest IN ('Suspected treatment failure','Suspeita de falha terapéutica'),1,NULL))`), "stf_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Repetição após AMA','Repeat after breastfeeding'),1,NULL))`), "repeat_after_breast_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed'  AND ReasonForTest IN ('Repetição após AMA','Repeat after breastfeeding'),1,NULL))`), "repeat_after_breast_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Reason Not Specified','Não preenchido'),1,NULL))`), "not_specified_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed'  AND ReasonForTest IN ('Reason Not Specified','Não preenchido'),1,NULL))`), "not_specified_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed',1,NULL))`), "suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed',1,NULL))`), "non_suppressed"],
        [literal(`COUNT(1)`), "total"],
      ],
      where: literal(`
        CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}' AND Hl7ResultStatusCode = 'F'
        AND RequestingProvinceName IS NOT NULL AND RequestingDistrictName IS NOT NULL`
        ),
      group: [
        col("RequestingProvinceName"), 
        col("RequestingDistrictName"), 
        col("RequestingFacilityName"), 
        literal("CASE WHEN Hl7SexCode IN ('','I','U') THEN 'Não especificado' ELSE Hl7SexCode END")
      ],
      order: [
        col("RequestingProvinceName"), 
        col("RequestingDistrictName"), 
        col("RequestingFacilityName"), 
        literal("CASE WHEN Hl7SexCode IN ('','I','U') THEN 'Não especificado' ELSE Hl7SexCode END")
      ]
    })

    return res.json(report)
  },

  async getVlReportForPregnant(req, res){
    const {start_date, end_date} = req.params;
    const report = await VlData.findAll({
      attributes: [
        [col("RequestingProvinceName"), "RequestingProvinceName"],
        [col("RequestingDistrictName"), "RequestingDistrictName"],
        [col("RequestingFacilityName"), "RequestingFacilityName"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Routine','Rotina'),1,NULL))`), "routine_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed' AND ReasonForTest IN ('Routine','Rotina'),1,NULL))`), "routine_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Suspected treatment failure','Suspeita de falha terapéutica'),1,NULL))`), "stf_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed' AND ReasonForTest IN ('Suspected treatment failure','Suspeita de falha terapéutica'),1,NULL))`), "stf_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Repetição após AMA','Repeat after breastfeeding'),1,NULL))`), "repeat_after_breast_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed'  AND ReasonForTest IN ('Repetição após AMA','Repeat after breastfeeding'),1,NULL))`), "repeat_after_breast_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Reason Not Specified','Não preenchido'),1,NULL))`), "not_specified_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed'  AND ReasonForTest IN ('Reason Not Specified','Não preenchido'),1,NULL))`), "not_specified_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed',1,NULL))`), "suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed',1,NULL))`), "non_suppressed"],
        [literal(`COUNT(1)`), "total"],
      ],
      where: literal(`
        CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}' AND Hl7ResultStatusCode = 'F'
        AND RequestingProvinceName IS NOT NULL AND RequestingDistrictName IS NOT NULL AND Pregnant IN ('Yes','yes','YES','SIM','Sim','sim')`
        ),
      group: [
        col("RequestingProvinceName"), 
        col("RequestingDistrictName"), 
        col("RequestingFacilityName"), 
      ],
      order: [
        col("RequestingProvinceName"), 
        col("RequestingDistrictName"), 
        col("RequestingFacilityName"), 
      ]
    })

    return res.json(report)
  },

  async getVlReportForBreastfeeding(req, res){
    const {start_date, end_date} = req.params;
    const report = await VlData.findAll({
      attributes: [
        [col("RequestingProvinceName"), "RequestingProvinceName"],
        [col("RequestingDistrictName"), "RequestingDistrictName"],
        [col("RequestingFacilityName"), "RequestingFacilityName"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Routine','Rotina'),1,NULL))`), "routine_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed' AND ReasonForTest IN ('Routine','Rotina'),1,NULL))`), "routine_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Suspected treatment failure','Suspeita de falha terapéutica'),1,NULL))`), "stf_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed' AND ReasonForTest IN ('Suspected treatment failure','Suspeita de falha terapéutica'),1,NULL))`), "stf_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Repetição após AMA','Repeat after breastfeeding'),1,NULL))`), "repeat_after_breast_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed'  AND ReasonForTest IN ('Repetição após AMA','Repeat after breastfeeding'),1,NULL))`), "repeat_after_breast_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed' AND ReasonForTest IN ('Reason Not Specified','Não preenchido'),1,NULL))`), "not_specified_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed'  AND ReasonForTest IN ('Reason Not Specified','Não preenchido'),1,NULL))`), "not_specified_non_suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Suppressed',1,NULL))`), "suppressed"],
        [literal(`COUNT(IIF(ViralLoadResultCategory = 'Not Suppressed',1,NULL))`), "non_suppressed"],
        [literal(`COUNT(1)`), "total"],
      ],
      where: literal(`
        CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}' AND Hl7ResultStatusCode = 'F'
        AND RequestingProvinceName IS NOT NULL AND RequestingDistrictName IS NOT NULL AND Breastfeeding IN ('Yes','yes','YES','SIM','Sim','sim')`
        ),
      group: [
        col("RequestingProvinceName"), 
        col("RequestingDistrictName"), 
        col("RequestingFacilityName"), 
      ],
      order: [
        col("RequestingProvinceName"), 
        col("RequestingDistrictName"), 
        col("RequestingFacilityName"), 
      ]
    })

    return res.json(report)
  },

  async getTurnaroundTimeByFacility(req, res) {
    const {start_date, end_date} = req.params;
    const report = await VlData.findAll({
      attributes: [
        [col("RequestingProvinceName"), "RequestingProvinceName"],
        [col("RequestingDistrictName"), "RequestingDistrictName"],
        [col("RequestingFacilityName"), "RequestingFacilityName"],
        [literal(`CASE WHEN AVG(DATEDIFF(DAY,SpecimenDatetime, ReceivedDatetime)) = 0 THEN 1 ELSE AVG(DATEDIFF(DAY,SpecimenDatetime, ReceivedDatetime)) END`), "collection_to_receive"],
        [literal(`CASE WHEN AVG(DATEDIFF(DAY,ReceivedDatetime,RegisteredDateTime)) = 0 THEN 1 ELSE AVG(DATEDIFF(DAY,ReceivedDatetime,RegisteredDateTime)) END`), "receive_to_registration"],
        [literal(`CASE WHEN AVG(DATEDIFF(DAY,RegisteredDateTime, AnalysisDateTime)) = 0 THEN 1 ELSE AVG(DATEDIFF(DAY,RegisteredDateTime, AnalysisDateTime)) END`), "registration_to_analysis"],
        [literal(`CASE WHEN AVG(DATEDIFF(DAY,AnalysisDateTime, AuthorisedDateTime)) = 0 THEN 1 ELSE AVG(DATEDIFF(DAY,AnalysisDateTime, AuthorisedDateTime)) END`), "analysis_to_validation"],
        [literal(`CASE WHEN AVG(DATEDIFF(DAY,SpecimenDatetime, AuthorisedDateTime)) = 0 THEN 1 ELSE AVG(DATEDIFF(DAY,SpecimenDatetime, AuthorisedDateTime)) END`), "tat"]
      ],
      where: literal(`CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}'
        AND Hl7ResultStatusCode = 'F' AND DATEDIFF(DAY, SpecimenDatetime, AuthorisedDateTime) <= 90 AND RequestingProvinceName IS NOT NULL `),
      group: [
        col("RequestingProvinceName"), 
        col("RequestingDistrictName"), 
        col("RequestingFacilityName"),
      ],
      order: [
        col("RequestingProvinceName"), 
        col("RequestingDistrictName"), 
        col("RequestingFacilityName"),
      ]
    });

    return res.json(report)
  },

  async getTurnaroundTimeByLab(req, res) {
    const {start_date, end_date} = req.params;
    const report = await VlData.findAll({
      attributes: [
        [col("TestingFacilityName"), "TestingFacilityName"],
        [literal(`CASE WHEN AVG(DATEDIFF(DAY,SpecimenDatetime, ReceivedDatetime)) = 0 THEN 1 ELSE AVG(DATEDIFF(DAY,SpecimenDatetime, ReceivedDatetime)) END`), "collection_to_receive"],
        [literal(`CASE WHEN AVG(DATEDIFF(DAY,ReceivedDatetime,RegisteredDateTime)) = 0 THEN 1 ELSE AVG(DATEDIFF(DAY,ReceivedDatetime,RegisteredDateTime)) END`), "receive_to_registration"],
        [literal(`CASE WHEN AVG(DATEDIFF(DAY,RegisteredDateTime, AnalysisDateTime)) = 0 THEN 1 ELSE AVG(DATEDIFF(DAY,RegisteredDateTime, AnalysisDateTime)) END`), "registration_to_analysis"],
        [literal(`CASE WHEN AVG(DATEDIFF(DAY,AnalysisDateTime, AuthorisedDateTime)) = 0 THEN 1 ELSE AVG(DATEDIFF(DAY,AnalysisDateTime, AuthorisedDateTime)) END`), "analysis_to_validation"],
        [literal(`CASE WHEN AVG(DATEDIFF(DAY,SpecimenDatetime, AuthorisedDateTime)) = 0 THEN 1 ELSE AVG(DATEDIFF(DAY,SpecimenDatetime, AuthorisedDateTime)) END`), "tat"]
      ],
      where: literal(`CAST(AnalysisDateTime AS date) >= '${start_date}' AND CAST(AnalysisDateTime AS date) <= '${end_date}'
        AND Hl7ResultStatusCode = 'F' AND DATEDIFF(DAY, SpecimenDatetime, AuthorisedDateTime) <= 90 AND TestingFacilityName IS NOT NULL `),
      group: [
        col("TestingFacilityName"), 
      ],
      order: [
        col("TestingFacilityName"),
      ]
    });

    return res.json(report)
  }
}
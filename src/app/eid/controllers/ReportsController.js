const {col, fn} = require("sequelize")
const {reportData} = require("../../../config/sequelize")
const SamplesBacklog = require("../models/SamplesBacklog")
const SamplesRegistered = require("../models/SamplesRegistered")
const SamplesTested = require("../models/SamplesTested")
const SamplesNonValidated = require("../models/SamplesNonValidated")
const EID = require("../models/EIDData")
const {eid} = require("../../../config/sequelize")

module.exports = {
    async getTotalIntrumentCapacity(req, res){
        const report = await reportData.query("SELECT * FROM [ReportData].[dbo].[weekly_intrument_report] ()", {raw: true});

        return res.json(report)
    },

    async getBackloggedSamples(req, res){
        const samples = await SamplesBacklog.findAll({
            attributes: [
                [col("LabName"), "LabName"],
                [col("TotalSamples"), "TotalSamples"],
                [col("SamplesLessThan15Days"), "SamplesLessThan15Days"],
                [col("SamplesBtw15and30Days"), "SamplesBtw15and30Days"],
                [col("SamplesGreaterThan30Days"), "SamplesGreaterThan30Days"],
                [col("SamplesWithoutCollectionDate"), "SamplesWithoutCollectionDate"],
            ],
            where: {
                week: "LAST"
            },
            order: [
                col("LabName")
            ]
        })

        return res.json(samples)
    },

    async getRegisteredSamples(req, res){
        const samples = await SamplesRegistered.findAll({
            attributes: [
                [col("LabName"), "LabName"],
                [col("TotalSamples"), "TotalSamples"],
                [col("SamplesLessThan15Days"), "SamplesLessThan15Days"],
                [col("SamplesBtw15and30Days"), "SamplesBtw15and30Days"],
                [col("SamplesGreaterThan30Days"), "SamplesGreaterThan30Days"],
                [col("SamplesWithoutCollectionDate"), "SamplesWithoutCollectionDate"],
            ],
            where: {
                week: "LAST"
            },
            order: [
                col("LabName")
            ]
        })

        return res.json(samples)
    },

    async getTestedSamples(req, res){
        const samples = await SamplesTested.findAll({
            attributes: [
                [col("LabName"), "LabName"],
                [col("TestedSamples"), "TestedSamples"],
                [col("RejectedSamples"), "RejectedSamples"],
                [col("TAT"), "TAT"],
                [col("SamplesLessThan15Days"), "SamplesLessThan15Days"],
                [col("SamplesBtw15and30Days"), "SamplesBtw15and30Days"],
                [col("SamplesGreaterThan30Days"), "SamplesGreaterThan30Days"],
                [col("SamplesWithoutCollectionDate"), "SamplesWithoutCollectionDate"],
                [col("SamplesRegisteredLessThan15Days"), "SamplesRegisteredLessThan15Days"],
                [col("SamplesRegisteredBtw15and30Days"), "SamplesRegisteredBtw15and30Days"],
                [col("SamplesRegisteredGreaterThan30Days"), "SamplesRegisteredGreaterThan30Days"],
            ],
            where: {
                week: "LAST"
            },
            order: [
                col("LabName")
            ]
        })

        return res.json(samples)
    },

    async getNonValidatedSamples(req, res){
        const samples = await SamplesNonValidated.findAll({
            attributes: [
                [col("LabName"), "LabName"],
                [col("NonValidatedSamples"), "NonValidatedSamples"],
                [col("SamplesTestedLessThan48Hours"), "SamplesTestedLessThan48Hours"],
                [col("SamplesTestedBtw2and5Days"), "SamplesTestedBtw2and5Days"],
                [col("SamplesGreaterThan5Days"), "SamplesGreaterThan5Days"],
                [col("SamplesTestedWithoutCollectionDate"), "SamplesTestedWithoutCollectionDate"],
            ],
            where: {
                week: "LAST"
            },
            order: [
                col("LabName")
            ]
        })

        return res.json(samples)
    },

    async getResultsByHealthFacility(req, res) {
        const {location} = req.params;
        const report = await eid.query(`
            SELECT 
                [RequestID]
                ,[FIRSTNAME]
                ,[SURNAME]
                ,[DOB]
                ,[EID_IDNo]
                ,[AgeInDays]
                ,[AgeInYears]
                ,[Hl7SexCode]
                ,ISNULL(CONVERT(VARCHAR(30), SpecimenDatetime, 105),'Não preenchido') SpecimenDatetime	
                ,ISNULL(CONVERT(VARCHAR(30), RegisteredDatetime, 105),'Não preenchido') RegisteredDatetime
                ,ISNULL(CONVERT(VARCHAR(30), AnalysisDatetime, 105),'Não preenchido') AnalysisDatetime	
                ,ISNULL(CONVERT(VARCHAR(30), AuthorisedDatetime, 105),'Não preenchido')	AuthorisedDatetime
                ,[RequestingProvinceName]
                ,[RequestingDistrictName]
                ,[RequestingFacilityName]
                ,[TestingFacilityName]
                ,CASE WHEN [Cuidador] = 'Unreported' THEN 'Não preenchido' ELSE [Cuidador] END [Cuidador]
                ,CASE WHEN [Cuidador_Cell] = 'Unreported' THEN 'Não preenchido' ELSE [Cuidador_Cell] END [Cuidador_Cell]
                ,[PatientConsent]
                ,[PTV_MAE]
                ,CASE WHEN [PTV_CRIANCA] = 'Unreported' THEN 'Não preenchido' ELSE [PTV_CRIANCA] END [PTV_CRIANCA]
                ,[EID_Date]
                ,[RapidHIV]
                ,[PCR_ANTERIOR]
                ,[POR_SEMANAS]
                ,CASE WHEN [TIPO_DE_COLHEITA] = 'Unreported' THEN 'Não preenchido' ELSE [TIPO_DE_COLHEITA] END [TIPO_DE_COLHEITA]
                ,[PCR_Result]
                ,[LIMSRejectionDesc]
            FROM EIDData.dbo.EID AS eid
            JOIN OpenLDRDict.dbo.viewFacilities AS fac ON fac.FacilityNationalCode = eid.RequestingFacilityCode OR fac.FacilityCode = eid.RequestingFacilityCode 
            OR fac.[Description] = eid.RequestingFacilityName
            WHERE fac.FacilityCode = '${location}' AND AnalysisDateTime IS NOT NULL AND 
            ((PCR_Result IS NOT NULL AND PCR_Result <> '') OR (LIMSRejectionCode IS NOT NULL AND LIMSRejectionCode <> '')) AND 
            YEAR(RegisteredDateTime) = YEAR(GETDATE())
        `);
        return res.json(report)
    }
}
const {col, fn, literal} = require("sequelize")
const {reportData} = require("../../../config/sequelize")
const SamplesBacklog = require("../models/SamplesBacklog")
const SamplesRegistered = require("../models/SamplesRegistered")
const SamplesTested = require("../models/SamplesTested")
const SamplesNonValidated = require("../models/SamplesNonValidated")
const VlData = require("../models/VlData")

module.exports = {
    async getTotalIntrumentCapacity(req, res){
        const report = await reportData.query("SELECT * FROM [ReportData].[dbo].[weekly_intrument_report] ()", {raw: true});

        return res.json(report[0])
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
        });

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
                [literal("0"), "SamplesValidatedWithoutCollectionDate"],
                [literal("0"), "SamplesValidatedWithMoreThan28Days"],
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

    async getFSRIncompletenessReport(req, res){
        const {start_date, end_date} = req.params;

        const report = await VlData.findAll({
            attributes: [
                [col("RequestingProvinceName"), "RequestingProvinceName"],
                [col("RequestingDistrictName"), "RequestingDistrictName"],
                [col("RequestingFacilityName"), "RequestingFacilityName"],
                [literal("ISNULL(TestingFacilityName, TestingFacilityCode)"), "TestingFacilityName"],
                [literal(`COUNT(1)`), "Total"],
                [literal(`COUNT(CASE WHEN AgeInYears IS NULL OR AgeInYears = '' THEN 1 ELSE NULL END)`), "Age"],
                [literal(`COUNT(CASE WHEN HL7SexCode IS NULL OR HL7SexCode = '' THEN 1 ELSE NULL END)`), "Gender"],
                [literal(`COUNT(CASE WHEN (REFNO IS NULL OR REFNO = '') AND (UNIQUEID IS NULL OR UNIQUEID = '') THEN 1 ELSE NULL END)`), "NID"],
                [literal(`COUNT(CASE WHEN SpecimenDatetime IS NULL THEN 1 ELSE NULL END)`), "CollectionDate"],
                [literal(`COUNT(CASE WHEN ReceivedDatetime IS NULL THEN 1 ELSE NULL END)`), "ReceiveDate"],
            ],
            where: literal(`HL7ResultStatusCode = 'F' AND CAST(AnalysisDateTime as date) >= '${start_date}' AND CAST(AnalysisDateTime as date) <= '${end_date}' AND RequestingProvinceName IS NOT NULL`),
            group: [
               literal(`RequestingProvinceName, RequestingDistrictName, RequestingFacilityName, ISNULL(TestingFacilityName, TestingFacilityCode)`) 
            ],
            order: [
                literal(`RequestingProvinceName, RequestingDistrictName, RequestingFacilityName, ISNULL(TestingFacilityName, TestingFacilityCode)`) 
             ]
        });

        return res.json(report)
    },

    async getResultsByHealthFacility(req, res) {
        const {location} = req.params;
        const report = await VlData.findAll({
            attributes: [
                [literal(`ViralLoad.dbo.generatePatientID(ISNULL(REFNO, UNIQUEID))`), 'nid'],
                [literal(`RIGHT(RequestID,10)`), 'RequestID'],
                [col('FIRSTNAME'), 'FIRSTNAME'],
                [col('SURNAME'), 'SURNAME'],
                [literal(`ISNULL(CAST(AgeInYears AS varchar(20)),'Não preenchido')`), "AgeInYears"],	
                [literal(`ISNULL(Hl7SexCode,'Não preenchido')`), "Hl7SexCode"],	
                [literal(`ISNULL(HIVVL_ViralLoadResult, HIVVL_ViralLoadCAPCTM)`), "HIVVL_ViralLoadCAPCTM"],		
                [literal(`IIF(ARTRegimen = 'Unreported','Não preenchido',ARTRegimen)`), "ARTRegimen"],
                [literal(`CASE WHEN Pregnant = 'Yes' THEN 'Sim' WHEN Pregnant = 'No' THEN 'Não' ELSE Pregnant END`), "Pregnant"],
                [literal(`CASE WHEN BreastFeeding = 'Yes' THEN 'Sim' WHEN BreastFeeding = 'No' THEN 'Não' ELSE BreastFeeding END`), "Breastfeeding"],
                [literal(`CASE WHEN ReasonForTest IN ('Routine') THEN 'Rotina' WHEN ReasonForTest IN ('Suspected treatment failure') THEN 'Suspeita de falha terapêutica' WHEN ReasonForTest IN ('Reason Not Specified') THEN 'Não preenchido' WHEN ReasonForTest IN ('Repetição após AMA') THEN 'Repetir após amamentação' ELSE ReasonForTest END`), "ReasonForTest"],	
                [literal(`CASE WHEN (LIMSRejectionCode IS NOT NULL AND LIMSRejectionCode <> '') OR (HIVVL_LIMSRejectionCode IS NOT NULL AND HIVVL_LIMSRejectionCode <> '') THEN 'Amostra Rejeitada' ELSE '' END`), "Rejection"], 
                [literal(`ISNULL(CONVERT(VARCHAR(30), SpecimenDatetime, 105),'Não preenchido')`), "SpecimenDatetime"],	
                [literal(`ISNULL(CONVERT(VARCHAR(30), RegisteredDatetime, 105),'Não preenchido')`), "RegisteredDatetime"],
                [literal(`ISNULL(CONVERT(VARCHAR(30), AnalysisDatetime, 105),'Não preenchido')`), "AnalysisDatetime"],	
                [literal(`ISNULL(CONVERT(VARCHAR(30), AuthorisedDatetime, 105),'Não preenchido')`), "AuthorisedDatetime"],
            ],
            where: literal(`LOCATION = '${location}' AND AnalysisDateTime IS NOT NULL AND 
            ((ViralLoadResultCategory IS NOT NULL AND ViralLoadResultCategory <> '') OR (LIMSRejectionCode IS NOT NULL AND LIMSRejectionCode <> '') OR (HIVVL_LIMSRejectionCode IS NOT NULL AND HIVVL_LIMSRejectionCode <> '')) AND 
            YEAR(RegisteredDateTime) = YEAR(GETDATE())`)
        });
        return res.json(report)
    },

    async monitoreLabBacklog(req, res){
        const report = await reportData.query(
            `SELECT back.LabName, back.Total, capacity.capacity FROM ReportData.dbo.VLSamplesBacklog AS back
             JOIN ReportData.dbo.LabCapacity AS capacity ON capacity.labname = back.LabName
             WHERE CAST(GETDATE() AS date) >= CAST(back.StartDate AS date) AND CAST(GETDATE() AS date) <= CAST(back.EndDate AS date)
             AND capacity.capacity < back.Total`
        );
        return res.json(report[0]);
    }
}
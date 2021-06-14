const {col, fn} = require("sequelize")
const {reportData} = require("../../../config/sequelize")
const SamplesBacklog = require("../models/SamplesBacklog")
const SamplesRegistered = require("../models/SamplesRegistered")
const SamplesTested = require("../models/SamplesTested")
const SamplesNonValidated = require("../models/SamplesNonValidated")

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
}
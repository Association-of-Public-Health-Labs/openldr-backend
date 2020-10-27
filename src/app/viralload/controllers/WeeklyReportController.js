const InstrumentCapacity = require("../models/InstrumentCapacity")
const {col, fn} = require("sequelize")
module.exports = {
    async getTotalIntrumentCapacity(req, res){
        const labs = await InstrumentCapacity.findAll({
            attributes: [
                [col("LabName"), "LabName"],
                [fn("SUM",col("Capacity")), "Capacity"],
                [fn("SUM",col("SamplesLastWeek")), "SamplesLastWeek"],
                [fn("SUM",col("SamplesCurrentWeek")), "SamplesCurrentWeek"]
            ],
            group: [
                col("LabName"),
            ],
            order: [
                col("LabName"),
            ]
        })

        return res.json(labs)
    },

    async getSamplesByInstrument(req, res){
        const samples = await InstrumentCapacity.findAll({
            attributes: [
                [col("LabName"), "LabName"],
                [col("Instrument"), "Instrument"],
                [col("Capacity"), "Capacity"],
                [col("SamplesLastWeek"), "SamplesLastWeek"],
                [col("SamplesCurrentWeek"), "SamplesCurrentWeek"]
            ],
            order: [
                col("LabName"),
                col("Instrument")
            ]
        })

        return res.json(samples)
    }
}
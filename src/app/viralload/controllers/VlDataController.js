const VlData = require("../models/VlData");
const indicators = require("./indicators/turnaroundtime");
const suppression = require("./indicators/suppression");
const samples = require("./indicators/samples");
const sequelize = require("sequelize");

const { Op } = sequelize;

module.exports = {
  async show(req, res) {
    const data = await VlData.findAll({
      where: { RequestID: req.params.id }
    });
    return res.json(data);
  },

  async getNumberOfSamplesByMonth(req, res) {
    const data = await VlData.findAll({
      attributes: [
        [sequelize.fn("year", sequelize.col("RegisteredDatetime")), "year"],
        [sequelize.fn("month", sequelize.col("RegisteredDatetime")), "month"],
        [
          sequelize.fn(
            "datename",
            sequelize.literal("MONTH"),
            sequelize.col("RegisteredDatetime")
          ),
          "month_name"
        ],
        [sequelize.fn("count", sequelize.col("RequestID")), "total"]
      ],
      group: [
        sequelize.fn("year", sequelize.col("RegisteredDatetime")),
        sequelize.fn("month", sequelize.col("RegisteredDatetime")),
        sequelize.fn(
          "datename",
          sequelize.literal("MONTH"),
          sequelize.col("RegisteredDatetime")
        )
      ]
    });
    return res.json(data);
  },

  async getTurnAroundTimeByMonth(req, res) {
    const data = await VlData.findAll({
      attributes: [
        [sequelize.fn("year", sequelize.col("RegisteredDatetime")), "year"],
        [sequelize.fn("month", sequelize.col("RegisteredDatetime")), "month"],
        [
          sequelize.fn(
            "datename",
            sequelize.literal("MONTH"),
            sequelize.col("RegisteredDatetime")
          ),
          "month_name"
        ],
        [sequelize.fn("count", sequelize.col("RequestID")), "total"]
      ],
      group: [
        sequelize.fn("year", sequelize.col("RegisteredDatetime")),
        sequelize.fn("month", sequelize.col("RegisteredDatetime")),
        sequelize.fn(
          "datename",
          sequelize.literal("MONTH"),
          sequelize.col("RegisteredDatetime")
        )
      ]
    });
    return res.json(data);
  },

  async getTatByLab(req, res) {
    return res.json(
      // await indicators.accumulative({ TestingFacilityCode: "PJV" })
      // await indicators.yearly({ TestingFacilityCode: "PJV" })
      // await indicators.monthly({ TestingFacilityCode: "PJV" })
      // await indicators.quarterly({ TestingFacilityCode: "PJV" })
      await indicators.weekly({ TestingFacilityCode: "PJV" })
    );
  },

  async getSuppression(req, res) {
    return res.json(
      // await suppression.accumulative({ TestingFacilityCode: "PJV" })
      // await suppression.yearly({ TestingFacilityCode: "PJV" })
      // await suppression.monthly({ TestingFacilityCode: "PJV" })
      // await suppression.quarterly({ TestingFacilityCode: "PJV" })
      await suppression.weekly({ TestingFacilityCode: "PJV" })
    );
  },

  async getSamples(req, res) {
    return res.json(
      await samples.accumulative({
        TestingFacilityCode: "PJV",
        RegisteredDatetime: {
          [Op.between]: ["2020-01-01", "2020-04-01"]
        }
      })
    );
  }
};

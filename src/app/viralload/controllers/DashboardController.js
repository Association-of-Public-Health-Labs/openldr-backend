const VlData = require("../models/VlData");
const global = require("./indicators/global");
const { col, literal, fn, Op } = require("sequelize");

module.exports = {
  async getNumberOfSamples(req, res) {
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.total, "total"]
      ],
      where: [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates
          }
        }
      ],
      group: [global.year, global.month],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"]
      ]
    });

    return res.json(data);
  },

  async getViralSuppression(req, res) {
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.total, "total"],
        [global.suppressed, "suppressed"]
      ],
      where: [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates
          }
        }
      ],
      group: [global.year, global.month],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"]
      ]
    });

    return res.json(data);
  },

  async getTurnAroundTime(req, res) {
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.collection_reception, "collection_reception"],
        [global.reception_registration, "reception_registration"],
        [global.registration_analysis, "registration_analysis"],
        [global.analysis_validation, "analysis_validation"]
      ],
      where: [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates
          }
        }
      ],
      group: [global.year, global.month],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"]
      ]
    });

    return res.json(data);
  }
};

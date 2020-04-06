const samples = require("./indicators/samples");
const sequelize = require("sequelize");
const global = require("./indicators/global");
const VlData = require("../models/VlData");
const { Op, fn, literal } = sequelize;

module.exports = {
  async getSamplesByTestReason(req, res) {
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates
          }
        }
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes
          },
          RegisteredDatetime: {
            [Op.between]: req.query.dates
          }
        }
      ];
    }

    const data = await samples.accumulative(where, [
      [sequelize.fn("count", sequelize.literal("1")), "total"],
      [global.routine, "routine"],
      [global.treatment_failure, "treatment_failure"],
      [global.reason_not_specified, "reason_not_specified"]
    ]);

    return res.json(data);
  },

  async getSamplesTestedByMonth(req, res) {
    var where = [];
    if (typeof req.query.codes === "undefined") {
      where = [
        {
          RegisteredDatetime: {
            [Op.between]: req.query.dates
          }
        }
      ];
    } else {
      where = [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes
          },
          RegisteredDatetime: {
            [Op.between]: req.query.dates
          }
        }
      ];
    }
    const data = await VlData.findAll({
      attributes: [
        [global.year, "year"],
        [global.month, "month"],
        [global.month_name, "month_name"],
        [global.total, "total"],
        [global.suppressed, "suppressed"],
        [global.non_suppressed, "non_suppressed"]
      ],
      where: where,
      group: [global.year, global.month, global.month_name],
      order: [
        [global.year, "ASC"],
        [global.month, "ASC"],
        [global.month_name, "ASC"]
      ]
    });
    return res.json(data);
  }
};

const sequelize = require("sequelize");
const VlData = require("../../models/VlData");
const { year, quarter, month, month_name, week } = require("./global");

const total = [sequelize.fn("count", sequelize.literal("1")), "total"];
const suppressed = [
  sequelize.fn(
    "count",
    sequelize.literal(
      `CASE WHEN ViralLoadResultCategory = 'Suppressed' THEN 1 ELSE NULL END`
    )
  ),
  "suppressed"
];

const not_suppressed = [
  sequelize.fn(
    "count",
    sequelize.literal(
      `CASE WHEN ViralLoadResultCategory = 'Not Suppressed' THEN 1 ELSE NULL END`
    )
  ),
  "not_suppressed"
];

module.exports = {
  async accumulative(clause) {
    const data = await VlData.findAll({
      attributes: [total, suppressed, not_suppressed],
      where: [clause]
    });
    return data;
  },

  async yearly(clause) {
    const data = await VlData.findAll({
      attributes: [[year, "year"], total, suppressed, not_suppressed],
      where: [clause],
      group: [year],
      order: [[year, "ASC"]]
    });
    return data;
  },

  async quarterly(clause) {
    const data = await VlData.findAll({
      attributes: [
        [year, "year"],
        [quarter, "quarter"],
        total,
        suppressed,
        not_suppressed
      ],
      where: [clause],
      group: [year, quarter],
      order: [year, [quarter, "DESC"]]
    });
    return data;
  },

  async monthly(clause) {
    const data = await VlData.findAll({
      attributes: [
        [year, "year"],
        [month, "month"],
        [month_name, "month_name"],
        total,
        suppressed,
        not_suppressed
      ],
      where: [clause],
      group: [year, month, month_name],
      order: [
        [year, "ASC"],
        [month, "ASC"],
        [month_name, "ASC"]
      ]
    });
    return data;
  },

  async weekly(clause) {
    const data = await VlData.findAll({
      attributes: [
        [year, "year"],
        [month, "month"],
        [month_name, "month_name"],
        [week, "week"],
        total,
        suppressed,
        not_suppressed
      ],
      where: [clause],
      group: [year, month, month_name, [week, "week"]],
      order: [
        [year, "ASC"],
        [month, "ASC"],
        [month_name, "ASC"],
        [week, "ASC"]
      ]
    });
    return data;
  }
};

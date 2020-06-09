const Sequelize = require("sequelize");
const { reports } = require("../../../config/sequelize");

const Reports = reports.define(
  "Reports",
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    email: Sequelize.STRING,
    report: Sequelize.TEXT,
  },
  { freezeTableName: true, timestamps: false }
);

reports.sync();
module.exports = Reports;

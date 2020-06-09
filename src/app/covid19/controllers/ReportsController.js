const Reports = require("../models/Reports");
const { col, literal, fn, Op } = require("sequelize");

module.exports = {
  async show(req, res) {
    const records = await Reports.findAll({
      where: { email: req.params.email },
    });
    return res.json(records);
  },

  async store(req, res) {
    const report = await Reports.create({
      email: req.body.email,
      report: req.body.report,
    });
    return res.json(report);
  },

  async update(req, res) {
    const report = await Reports.update(
      {
        report: req.body.report,
      },
      {
        where: {
          email: req.body.email,
        },
      }
    );
    return res.json(report);
  },
};

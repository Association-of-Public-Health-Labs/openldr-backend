const Covid19 = require("../models/Covid19");
const { col, literal, fn, Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  async show(req, res) {
    const records = await Covid19.findAll({
      where: { RequestID: "MZDISAPMB0114464" },
    });
    return res.json(records);
  },

  async paginate(req, res) {
    const { docs, pages, total } = await Covid19.paginate({
      attributes: [
        "FIRSTNAME",
        "SURNAME",
        "AgeInYears",
        "MOBILE",
        "RequestingProvinceName",
        "RequestingDistrictName",
        "RequestingFacilityName",
        "SpecimenDatetime",
        "AnalysisDatetime",
      ],
      page: req.params.page, // Default 1
      paginate: parseInt(req.params.paginate),
    });
    return res.json({ docs, pages, total, page: parseInt(req.params.page) });
  },
};

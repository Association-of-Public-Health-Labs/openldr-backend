const sequelize = require("sequelize");
const Laboratories = require("../models/Laboratories");

const Op = sequelize.Op;

const LaboratoryController = {
  async show(req, res) {
    const labs = await Laboratories.findAll({
      where: {
        [Op.or]: [{ LabCode: req.params.lab }, { LabName: req.params.lab }]
      }
    });
    res.json(labs);
  },
  async showAll(req, res) {
    const labs = await Laboratories.findAll();
    res.json(labs);
  }
};

module.exports = LaboratoryController;

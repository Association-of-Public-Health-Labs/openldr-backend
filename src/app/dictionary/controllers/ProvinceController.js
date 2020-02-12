const sequelize = require("sequelize");
const Facilities = require("../models/Facilities");

const Op = sequelize.Op;
const fn = sequelize.fn;
const col = sequelize.col;

const ProvinceController = {
  async show(req, res) {
    const province = await Facilities.findAll({
      attributes: [
        [fn("DISTINCT", col("ProvinceCode")), "ProvinceCode"],
        "CountryCode",
        "CountryName",
        "ProvinceName"
      ],
      where: {
        [Op.or]: [
          { ProvinceCode: req.params.province },
          { ProvinceName: req.params.province }
        ]
      }
    });
    return res.json(province);
  },

  async showAll(req, res) {
    const provinces = await Facilities.findAll({
      attributes: [
        [fn("DISTINCT", col("ProvinceCode")), "ProvinceCode"],
        "CountryCode",
        "CountryName",
        "ProvinceName"
      ],
      where: {
        [Op.and]: [
          { ProvinceCode: { [Op.ne]: null } },
          { ProvinceCode: { [Op.not]: "" } }
        ]
      }
    });
    return res.json(provinces);
  }
};

module.exports = ProvinceController;

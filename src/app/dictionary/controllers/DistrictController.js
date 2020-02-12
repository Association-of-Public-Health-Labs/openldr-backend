const sequelize = require("sequelize");
const Facilities = require("../models/Facilities");

const Op = sequelize.Op;
const fn = sequelize.fn;
const col = sequelize.col;

const DistrictController = {
  async show(req, res) {
    const district = await Facilities.findAll({
      attributes: [
        [fn("DISTINCT", col("DistrictCode")), "DistrictCode"],
        "CountryCode",
        "CountryName",
        "ProvinceCode",
        "ProvinceName",
        "DistrictName"
      ],
      where: {
        [Op.or]: [
          { DistrictCode: req.params.district },
          { DistrictName: req.params.district }
        ]
      }
    });
    return res.json(district);
  },

  async showAll(req, res) {
    const district = await Facilities.findAll({
      attributes: [
        [fn("DISTINCT", col("DistrictCode")), "DistrictCode"],
        "CountryCode",
        "CountryName",
        "ProvinceCode",
        "ProvinceName",
        "DistrictName"
      ]
    });
    return res.json(district);
  },

  async showByProvince(req, res) {
    const districts = await Facilities.findAll({
      attributes: [
        [fn("DISTINCT", col("DistrictCode")), "DistrictCode"],
        "CountryCode",
        "CountryName",
        "ProvinceCode",
        "ProvinceName",
        "DistrictName"
      ],
      where: {
        [Op.or]: [
          { ProvinceName: req.params.province },
          { ProvinceCode: req.params.province }
        ]
      }
    });
    return res.json(districts);
  }
};

module.exports = DistrictController;

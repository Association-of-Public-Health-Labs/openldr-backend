import { Op, fn, col } from "sequelize";
import Facilities from "../models/Facilities";

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

const sequelize = require("sequelize");
const Facilities = require("../models/Facilities");

const Op = sequelize.Op;

const ClinicController = {
  async show(req, res) {
    const clinic = await Facilities.findAll({
      where: {
        [Op.or]: [
          { FacilityCode: req.params.id },
          { Description: req.params.id }
        ]
      }
    });
    return res.json(clinic);
  },

  async showAll(req, res) {
    const clinic = await Facilities.findAll();
    return res.json(clinic);
  },

  async showDisalinks(req, res) {
    const clinics = await Facilities.findAll({
      where: { Description: { [Op.like]: "%Dlink%" } }
    });
    return res.json(clinics);
  },

  async showByProvince(req, res) {
    const clinics = await Facilities.findAll({
      where: {
        [Op.or]: [
          { ProvinceName: req.params.province },
          { ProvinceCode: req.params.province }
        ]
      }
    });
    return res.json(clinics);
  },

  async showByDistrict(req, res) {
    const clinics = await Facilities.findAll({
      where: {
        [Op.or]: [
          { DistrictName: req.params.district },
          { DistrictCode: req.params.district }
        ]
      }
    });
    return res.json(clinics);
  },

  async showByProvinceOrDistrict(req, res) {
    const clinics = await Facilities.findAll({
      where: {
        [Op.or]: [
          { DistrictName: { [Op.in]: req.query.districts } },
          { ProvinceName: { [Op.in]: req.query.provinces } }
        ]
      }
    });
    return res.json(clinics);
  }
};

module.exports = ClinicController;

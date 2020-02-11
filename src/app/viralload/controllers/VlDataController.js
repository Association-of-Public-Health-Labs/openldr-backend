import VlData from "../models/VlData";

module.exports = {
  async show(req, res) {
    const data = await VlData.findAll({
      where: { RequestID: req.params.id }
    });
    return res.json(data);
  }
};

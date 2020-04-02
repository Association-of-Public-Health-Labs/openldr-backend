const sequelize = require("sequelize");
const VlData = require("../../models/VlData");

const { year, quarter, month, month_name, week } = require("./global");
const total = [sequelize.fn("count", sequelize.literal("1")), "total"];
const { Op } = sequelize;
module.exports = {
  // async accumulative(clause) {
  //   const data = await VlData.findAll({
  //     attributes: [
  //       total,
  //       [
  //         sequelize.fn(
  //           "count",
  //           sequelize.literal(
  //             `CASE WHEN AnalysisDatetime IS NOT NULL AND AnalysisDatetime <> '' THEN 1 ELSE NULL END`
  //           )
  //         ),
  //         "tested"
  //       ],
  //       [
  //         sequelize.fn(
  //           "count",
  //           sequelize.literal(
  //             `CASE WHEN (LIMSRejectionCode IS NOT NULL AND LIMSRejectionCode <> '') OR (HIVVl_LIMSRejectionCode IS NOT NULL AND HIVVL_LIMSRejectionCode <> '') THEN 1 ELSE NULL END`
  //           )
  //         ),
  //         "rejected"
  //       ],
  //       [
  //         sequelize.fn(
  //           "count",
  //           sequelize.literal(
  //             `CASE WHEN AnalysisDatetime IS NOT NULL AND AuthorisedDatetime IS NULL AND ViralLoadResultCategory IS NOT NULL THEN 1 ELSE NULL END`
  //           )
  //         ),
  //         "non_validated"
  //       ]
  //     ],
  //     where: clause
  //   });
  //   return data;
  // }

  async accumulative(clauses, attributes) {
    const data = await VlData.findAll({
      where: clauses,
      attributes: attributes
    });
    return data;
  }
};

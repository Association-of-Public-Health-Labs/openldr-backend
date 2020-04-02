const samples = require("./indicators/samples");
const sequelize = require("sequelize");
const { Op } = sequelize;

module.exports = {
  async getSamplesByTestReason(req, res) {
    const data = await samples.accumulative(
      [
        {
          TestingFacilityCode: {
            [Op.in]: req.query.codes
          },
          RegisteredDatetime: {
            [Op.between]: req.query.dates
          }
        }
      ],
      [
        [sequelize.fn("count", sequelize.literal("1")), "total"],
        [
          sequelize.fn(
            "count",
            sequelize.literal(
              `CASE WHEN ReasonForTest IN ('Routine') THEN 1 ELSE NULL END`
            )
          ),
          "routine"
        ],
        [
          sequelize.fn(
            "count",
            sequelize.literal(
              `CASE WHEN ReasonForTest IN ('Suspected treatment failure','Suspeita de falha terapêutica') THEN 1 ELSE NULL END`
            )
          ),
          "treatment_failure"
        ],
        [
          sequelize.fn(
            "count",
            sequelize.literal(
              `CASE WHEN ReasonForTest IN ('Não preenchido','Reason Not Specified') THEN 1 ELSE NULL END`
            )
          ),
          "reason_not_specified"
        ]
      ]
    );

    return res.json(data);
  }
};

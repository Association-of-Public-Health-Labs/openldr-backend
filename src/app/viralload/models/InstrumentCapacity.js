const Sequelize = require("sequelize");
const { reportData } = require("../../../config/sequelize");

const InstrumentCapacity = reportData.define(
  "InstrumentCapacity",
  {
    LabName: Sequelize.STRING,
    Instrument: Sequelize.STRING,
    Capacity: Sequelize.INTEGER,
    SamplesLastWeek: Sequelize.INTEGER,
    SamplesCurrentWeek: Sequelize.INTEGER,
    UpdatedAt: Sequelize.DATE
  },
  { freezeTableName: true, timestamps: false }
);

// vldata.sync();
InstrumentCapacity.removeAttribute("id")
module.exports = InstrumentCapacity;

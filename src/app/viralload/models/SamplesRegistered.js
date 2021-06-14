const Sequelize = require("sequelize");
const { reportData } = require("../../../config/sequelize");

const SamplesRegistered = reportData.define(
  "SamplesRegistered",
  {
    LabName: Sequelize.STRING,
		Week: Sequelize.STRING,
		TotalSamples: Sequelize.INTEGER,
		SamplesLessThan15Days: Sequelize.INTEGER,
		SamplesBtw15and30Days: Sequelize.INTEGER,
		SamplesGreaterThan30Days: Sequelize.INTEGER,
		SamplesWithoutCollectionDate: Sequelize.INTEGER,
		UpdatedAt: Sequelize.DATE
  },
  { freezeTableName: true, timestamps: false }
);

// vldata.sync();
SamplesRegistered.removeAttribute("id")
module.exports = SamplesRegistered;

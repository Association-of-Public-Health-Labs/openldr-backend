const Sequelize = require("sequelize");
const { reportData } = require("../../../config/sequelize");

const SamplesTested = reportData.define(
  "EIDSamplesTested",
  {
    LabName: Sequelize.STRING,
		Week: Sequelize.STRING,
		TestedSamples: Sequelize.INTEGER,
		RejectedSamples: Sequelize.INTEGER,
		TAT: Sequelize.INTEGER,
		SamplesLessThan15Days: Sequelize.INTEGER,
		SamplesBtw15and30Days: Sequelize.INTEGER,
		SamplesGreaterThan30Days: Sequelize.INTEGER,
		SamplesWithoutCollectionDate: Sequelize.INTEGER,
		SamplesRegisteredLessThan15Days: Sequelize.INTEGER,
		SamplesRegisteredBtw15and30Days: Sequelize.INTEGER,
		SamplesRegisteredGreaterThan30Days: Sequelize.INTEGER,
    UpdatedAt: Sequelize.DATE
  },
  { 
		freezeTableName: true, timestamps: false 
	}
);

// vldata.sync();
SamplesTested.removeAttribute("id")
module.exports = SamplesTested;

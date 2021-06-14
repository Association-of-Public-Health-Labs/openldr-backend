const Sequelize = require("sequelize");
const { reportData } = require("../../../config/sequelize");

const SamplesNonValidated = reportData.define(
  "SamplesNonValidated",
  {
    LabName: Sequelize.STRING,
    Week: Sequelize.STRING,
    NonValidatedSamples: Sequelize.INTEGER,
    SamplesTestedLessThan48Hours: Sequelize.INTEGER,
    SamplesTestedBtw2and5Days: Sequelize.INTEGER,
    SamplesGreaterThan5Days: Sequelize.INTEGER,
    SamplesTestedWithoutCollectionDate: Sequelize.INTEGER,
    UpdatedAt: Sequelize.DATE
  },
  { freezeTableName: true, timestamps: false }
);

// vldata.sync();
SamplesNonValidated.removeAttribute("id")
module.exports = SamplesNonValidated;

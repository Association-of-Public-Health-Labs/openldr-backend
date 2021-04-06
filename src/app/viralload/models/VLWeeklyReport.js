const Sequelize = require("sequelize");
const { reportData } = require("../../../config/sequelize");

const VLWeeklyReport = reportData.define(
  "Resume",
  {
    LabCode: Sequelize.STRING,
	LabName: Sequelize.STRING,
	Week: Sequelize.STRING,
	StartDate: Sequelize.DATE,
	EndDate: Sequelize.DATE,
	Tests: Sequelize.INTEGER,
	Backlogs: Sequelize.INTEGER,
	TAT: Sequelize.FLOAT,
	Registrations: Sequelize.INTEGER,
	Capacity: Sequelize.INTEGER,
	Rejections: Sequelize.INTEGER,
	UpdatedAt: Sequelize.DATE
  },
  { freezeTableName: true, timestamps: false }
);

// vldata.sync();
VLWeeklyReport.removeAttribute("id")
module.exports = VLWeeklyReport;

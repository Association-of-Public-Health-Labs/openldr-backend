const Sequelize = require("sequelize");
const { facilities } = require("../../../config/sequelize");

const Laboratories = facilities.define(
  "Laboratories",
  {
    DateTimeStamp: Sequelize.DATE,
    VersionStamp: Sequelize.STRING,
    LIMSVendorCode: Sequelize.STRING,
    LabCode: Sequelize.STRING,
    FacilityCode: Sequelize.STRING,
    LabName: Sequelize.STRING,
    LabType: Sequelize.STRING,
    StaffingLevel: Sequelize.STRING
  },
  { timestamps: false }
);
Laboratories.removeAttribute("id");
// facilities.sync({force: true});
module.exports = Laboratories;

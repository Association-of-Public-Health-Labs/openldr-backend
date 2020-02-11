import Sequelize from "sequelize";

const reports = new Sequelize("ViralLoad", "sa", "disalab", {
  host: "localhost",
  dialect: "mssql",
  dialectOptions: {
    options: { requestTimeout: 30000000 }
  }
});

const vldata = new Sequelize("ViralLoadData", "sa", "disalab", {
  host: "localhost",
  dialect: "mssql",
  dialectOptions: {
    options: { requestTimeout: 30000000 }
  }
});

const facilities = new Sequelize("OpenLDRDict", "sa", "disalab", {
  host: "localhost",
  dialect: "mssql",
  dialectOptions: {
    options: { requestTimeout: 30000000 }
  }
});

module.exports = { reports: reports, vldata: vldata, facilities: facilities };

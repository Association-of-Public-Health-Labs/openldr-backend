const Sequelize = require("sequelize");

const reports = new Sequelize(
  process.env.REPORT_DB,
  process.env.REPORT_USER,
  process.env.REPORT_PASSWORD,
  {
    host: process.env.REPORT_HOST,
    dialect: "mssql",
    dialectOptions: {
      options: { requestTimeout: 30000000 }
    }
  }
);

const vldata = new Sequelize(
  process.env.VL_DB,
  process.env.VL_USER,
  process.env.VL_PASSWORD,
  {
    host: process.env.VL_HOST,
    dialect: "mssql",
    dialectOptions: {
      options: { requestTimeout: 30000000 }
    }
  }
);

const facilities = new Sequelize(
  process.env.DICT_DB,
  process.env.DICT_USER,
  process.env.DICT_PASSWORD,
  {
    host: process.env.DICT_HOST,
    dialect: "mssql",
    dialectOptions: {
      options: { requestTimeout: 30000000 }
    }
  }
);

module.exports = { vldata: vldata, facilities: facilities };

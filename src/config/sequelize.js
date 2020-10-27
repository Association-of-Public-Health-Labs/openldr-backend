const Sequelize = require("sequelize");

const reports = new Sequelize(
  process.env.REPORT_DB,
  process.env.REPORT_USER,
  process.env.REPORT_PASSWORD,
  {
    host: process.env.REPORT_HOST,
    dialect: "mssql",
    dialectOptions: {
      options: { requestTimeout: 30000000 },
    },
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
      options: { requestTimeout: 30000000 },
    },
  }
);


const reportData = new Sequelize(
  process.env.REPORT_DATA_DB,
  process.env.REPORT_DATA_USER,
  process.env.REPORT_DATA_PASSWORD,
  {
    host: process.env.REPORT_DATA_HOST,
    dialect: "mssql",
    dialectOptions: {
      options: { requestTimeout: 30000000 },
    },
  }
);

const covid19 = new Sequelize(
  process.env.COVID_DB,
  process.env.COVID_USER,
  process.env.COVID_PASSWORD,
  {
    host: process.env.COVID_HOST,
    dialect: "mssql",
    dialectOptions: {
      options: { requestTimeout: 30000000 },
    },
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
      options: { requestTimeout: 30000000 },
    },
  }
);

module.exports = {
  reports: reports,
  vldata: vldata,
  facilities: facilities,
  covid19: covid19,
  reportData: reportData
};

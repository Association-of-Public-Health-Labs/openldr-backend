const Sequelize = require("sequelize");
const { reports, vldata } = require("../../../config/sequelize");
const User = require("./User");

const Role = reports.define(
  "role",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    role_code: {
      type: Sequelize.STRING,
      isUnique: true,
    },
    status: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
  },
  { freezeTableName: true, timestamps: false }
);

// Role.sync({ force: true });
// Role.belongsTo(User, { foreignKey: "user_id" });
module.exports = Role;

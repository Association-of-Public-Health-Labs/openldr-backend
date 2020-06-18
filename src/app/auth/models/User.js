const Sequelize = require("sequelize");
const { reports, vldata } = require("../../../config/sequelize");
// const Role = require("./Role");

const User = reports.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
      isUnique: true,
    },
    email: {
      type: Sequelize.STRING,
      isUnique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

User.sync({ force: true });
// User.belongsTo(Role, { foreignKey: "user_id" });
module.exports = User;

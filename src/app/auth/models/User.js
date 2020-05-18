const Sequelize = require("sequelize");
const { vldata } = require("../../../config/sequelize");

const User = vldata.define(
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
  { freezeTableName: true, timestamps: false }
);

// User.sync();
module.exports = User;

const sequelize = require("sequelize");
const db = require("../index");

const user = db.define(
  "usuarios",
  {
    id: { type: sequelize.INTEGER, primaryKey: true },
    name: { type: sequelize.STRING },
    email: { type: sequelize.STRING },
    code: { type: sequelize.STRING }
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = user;

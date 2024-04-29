const sequelize = require("sequelize");
const db = require("../index");

const rol = db.define(
  "roles",
  {
    id: { type: sequelize.INTEGER, primaryKey: true },
    name: { type: sequelize.STRING },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = rol;

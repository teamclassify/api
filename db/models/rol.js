const sequelize = require("sequelize");
const db = require("../index");

const rol = db.define(
  "rol",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: sequelize.STRING },
  },
  {
    timestamps: false,
  }
);

module.exports = rol;

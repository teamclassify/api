const sequelize = require("sequelize");
const db = require("../index");

const user = db.define(
  "usuario",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    codigo: { type: sequelize.INTEGER },
    nombre: { type: sequelize.STRING },
    correo: { type: sequelize.STRING }
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = user;

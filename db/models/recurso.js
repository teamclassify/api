const sequelize = require("sequelize");
const db = require("../index");

const recurso = db.define(
  "recursos",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: sequelize.STRING },
    descripcion: { type: sequelize.STRING },
    img: { type: sequelize.STRING },
  },
  {
    timestamps: false,
  }
);

module.exports = recurso;

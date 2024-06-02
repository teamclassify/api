const sequelize = require("sequelize");
const db = require("../index");

const roomResources = db.define(
  "sala_recursos",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: sequelize.STRING },
    descripcion: { type: sequelize.STRING },
  },
  {
    timestamps: false,
  }
);

module.exports = roomResources;

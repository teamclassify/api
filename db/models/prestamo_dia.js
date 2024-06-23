const sequelize = require("sequelize");
const db = require("../index");

const prestamoDia = db.define(
  "prestamo_dia",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    dia: { type: sequelize.STRING },
    hora_inicio: { type: sequelize.INTEGER },
    hora_fin: { type: sequelize.INTEGER },
    prestamo_id: { type: sequelize.INTEGER, references: {model: 'prestamo', key: 'id'}}
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = prestamoDia;

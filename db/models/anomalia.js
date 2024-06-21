const sequelize = require("sequelize");
const db = require("../index");

const anomalia = db.define(
  "anomalia",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    descripcion: { type: sequelize.TEXT },
    usuario_id: { type: sequelize.INTEGER, references: {model: 'usuario_rol', key: 'id'} },
    sala_id: { type: sequelize.INTEGER, references: {model: 'sala', key: 'id'} },
    prestamo_id: { type: sequelize.INTEGER, references: {model: 'prestamo', key: 'id'} },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = anomalia;

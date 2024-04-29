const sequelize = require("sequelize");
const db = require("../index");

const hora = db.define(
  "hora",
  {
    id: { type: sequelize.INTEGER, primaryKey: true },
    dia_id: { type: sequelize.INTEGER, references: {model: 'dia', key: 'id'}},
    evento_id: { type: sequelize.INTEGER, references: {model: 'evento', key: 'id'}},
    hora_inicio: { type: sequelize.DATE},
    hora_fin: {type: sequelize.DATE}
  },
);

module.exports = hora;

const sequelize = require("sequelize");
const db = require("../index");

const retroalimentacion = db.define(
  "retroalimentacion",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    prestamo_id: { type: sequelize.INTEGER, references: {model: 'prestamo', key: 'id'}},
    usuario_id: { type: sequelize.STRING, references: {model: 'usuario', key: 'id'}},
    valoracion: { type: sequelize.INTEGER },
    comentario: { type: sequelize.STRING },
  },
);

module.exports = retroalimentacion;
const sequelize = require("sequelize");
const db = require("../index");

const clase = db.define(
  "clase",
  {
    id: { type: sequelize.INTEGER, primaryKey: true },
    nombre: { type: sequelize.STRING},
    cod_asignatura: { type: sequelize.INTEGER},
    cod_docente: {type: sequelize.INTEGER},
    grupo: { type: sequelize.CHAR},
    usuario_id: { type: sequelize.INTEGER, references: {model: 'usuario', key: 'id'}},
    estado_id: { type: sequelize.INTEGER, references: {model: 'estado_prestamo', key: 'id'}}
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

clase.associate = function (models) {
  clase.hasMany(models.Evento, { as: "evento" });
};

module.exports = clase;

const sequelize = require("sequelize");
const db = require("../index");

const prestamo = db.define(
  "prestamo",
  {
    id: { type: sequelize.INTEGER, primaryKey: true },
    usuario_id: { type: sequelize.INTEGER, references: {model: 'usuario_rol', key: 'id'}},
    razon: {type: sequelize.STRING},
    estado_id: { type: sequelize.INTEGER, references: {model: 'estado_prestamo', key: 'id'}},
    cantidad_personas: { type: sequelize.INTEGER }
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

prestamo.associate = function (models) {
  prestamo.hasOne(models.Evento, { as: "evento" });
};

module.exports = prestamo;

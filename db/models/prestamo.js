const sequelize = require("sequelize");
const db = require("../index");

const prestamo = db.define(
  "prestamo",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: {
      type: sequelize.INTEGER,
      references: { model: "usuario_rol", key: "id" },
    },
    razon: { type: sequelize.STRING },
    estado: { type: sequelize.STRING },
    hora_inicio: { type: sequelize.INTEGER },
    hora_fin: { type: sequelize.INTEGER },
    fecha: { type: sequelize.DATE },
    cantidad_personas: { type: sequelize.INTEGER },
    sala_id: { type: sequelize.INTEGER },
    recursos: { type: sequelize.STRING },
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

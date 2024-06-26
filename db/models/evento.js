const sequelize = require("sequelize");
const db = require("../index");

const evento = db.define(
  "evento",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    clase_id: {
      type: sequelize.INTEGER,
      references: { model: "clase", key: "id" },
    },
    prestamo_id: {
      type: sequelize.INTEGER,
      references: { model: "prestamo", key: "id" },
    },
    asistencia: {  type: sequelize.BOOLEAN, default: false }
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

evento.associate = function (models) {
  evento.hasMany(models.Hora, { as: "hora" });
};

module.exports = evento;

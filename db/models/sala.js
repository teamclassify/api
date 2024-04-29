const sequelize = require("sequelize");
const db = require("../index");

const sala = db.define(
  "sala",
  {
    id: { type: sequelize.INTEGER, primaryKey: true },
    nombre: { type: sequelize.STRING },
    capacidad: { type: sequelize.INTEGER },
    edificio_id: { type: sequelize.INTEGER, references: { model: 'edificio', key: 'id'}},
    cantidad_computadores: { type: sequelize.INTEGER },
  },
);

sala.associate = function (models) {
  sala.hasOne(models.Horario, { as: "horario" });
};

module.exports = sala;

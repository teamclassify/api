const db = require("../index");
const recurso = require("./recurso");
const sala = require("./sala");
const sequelize = require("sequelize");

const SalaRecurso = db.define("sala_recursos", {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    sala_id: { type: sequelize.INTEGER, references: { model: 'salas', key: 'id'}},
    recurso_id: { type: sequelize.INTEGER, references: { model: 'recursos', key: 'id'}},
    activo: { type: sequelize.BOOLEAN, default: true },
  },
  {
    timestamps: false,
  }
);

recurso.belongsToMany(sala, {
  through: SalaRecurso,
  foreignKey: "recurso_id",
  otherKey: "sala_id",
});

sala.belongsToMany(recurso, {
  through: SalaRecurso,
  foreignKey: "sala_id",
  otherKey: "recurso_id",
});

module.exports = SalaRecurso;
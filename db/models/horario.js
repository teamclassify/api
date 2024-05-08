const sequelize = require("sequelize");
const db = require("../index");

const horario = db.define(
  "horario",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    sala_id: { type: sequelize.INTEGER, references: {model: 'sala', key: 'id'}}
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

horario.associate = function (models) {
  horario.hasMany(models.Dia, { as: "dia" });
};

module.exports = horario;

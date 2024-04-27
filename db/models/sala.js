const sequelize = require("sequelize");
const db = require("../index");
const edificio = require("./edificio");

const sala = db.define(
  "salas",
  {
    id: { type: sequelize.INTEGER, primaryKey: true },
    name: { type: sequelize.STRING },
    capacity: { type: sequelize.INTEGER },
    building: { type: sequelize.INTEGER },
    cantity_pc: { type: sequelize.INTEGER },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = sala;

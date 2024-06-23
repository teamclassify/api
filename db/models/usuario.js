const sequelize = require("sequelize");
const db = require("../index");

const user = db.define(
  "usuario",
  {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    codigo: { type: sequelize.INTEGER },
    nombre: { type: sequelize.STRING },
    correo: { type: sequelize.STRING },
    photo: { type: sequelize.STRING },
    username: { type: sequelize.STRING },
    estado: { type: sequelize.STRING },
    tipo: { type: sequelize.STRING },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = user;

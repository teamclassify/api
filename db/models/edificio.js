const sequelize = require("sequelize");
const db = require("../index");

const edificio = db.define(
  "edificio",
  {
    id: { type: sequelize.INTEGER, primaryKey: true },
    nombre: { type: sequelize.STRING },
  },
  {
    timestamps: false,
  }
);


edificio.associate = function (models) {
  edificio.hasMany(models.Sala, { as: "sala" });
};

module.exports = edificio;

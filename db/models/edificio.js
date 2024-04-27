const sequelize = require("sequelize");
const db = require("../index");

const edificio = db.define(
  "edificios",
  {
    id: { type: sequelize.INTEGER, primaryKey: true },
    name: { type: sequelize.STRING },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

edificio.associate = function (models) {
  edificio.hasMany(models.Sala, { as: "salas" });
};

module.exports = edificio;

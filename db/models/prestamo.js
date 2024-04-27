const sequelize = require("sequelize");
const db = require("../index");

const prestamo = db.define(
  "prestamos",
  {
    id: { type: sequelize.INTEGER, primaryKey: true },
    amount_people: { type: sequelize.INTEGER },
    in_charge: { type: sequelize.STRING },
    semester: { type: sequelize.INTEGER },
    start_date: { type: sequelize.DATE },
    end_date: { type: sequelize.DATE }
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = prestamo;

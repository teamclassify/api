const sequelize = require("sequelize");
const db = require("../index");

const calendario = db.define(
  "calendarios",
  {
    id: { type: sequelize.INTEGER, primaryKey: true },
    year: { type: sequelize.INTEGER },
    semester: { type: sequelize.INTEGER },
    start_date: { type: sequelize.DATE },
    end_date: { type: sequelize.DATE }
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = calendario;

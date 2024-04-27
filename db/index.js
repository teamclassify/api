const sequelize = require("sequelize");
const mysql2 = require("mysql2");

const { DB_NAME, DB_HOST, DB_PASSWORD, DB_USER } = require("../config");

const db = new sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: "mysql",
  dialectModule: mysql2,
  host: DB_HOST,
});

db.authenticate()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => console.log("error db connect", err));

module.exports = db;

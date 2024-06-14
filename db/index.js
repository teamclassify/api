const sequelize = require("sequelize");
const mysql2 = require("mysql2");

const { DB_NAME, DB_HOST, DB_PASSWORD, DB_USER, DB_PORT} = require("../config");

const db = new sequelize({
  database: DB_NAME,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  dialect: "mysql",
  dialectModule: mysql2,
  host: DB_HOST,
  ssl: false
});

db.authenticate()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => console.log("error db connect", err));

module.exports = db;

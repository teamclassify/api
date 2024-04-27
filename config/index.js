require("dotenv").config();

const PORT = process.env.PORT || 8080;
const MODE = process.env.MODE || "dev";

module.exports = {
  PORT,
  MODE,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
};

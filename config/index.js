require("dotenv").config();

const PAGINATION_LIMIT = 2;
const PORT = process.env.PORT || 8080;
const MODE = process.env.MODE || "dev";
const EMAIL = {
  HOST: process.env.EMAIL_SMPT_HOST,
  PORT: process.env.EMAIL_SMPT_PORT,
  SERVICE: process.env.EMAIL_SMPT_SERVICE,
  MAIL: process.env.EMAIL_SMPT_MAIL,
  APP_PASS: process.env.EMAIL_SMPT_APP_PASS
}

const FIREBASE = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY
    ? process.env.PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.CLIENT_CERT,
  universe_domain: "googleapis.com"
};

module.exports = {
  PAGINATION_LIMIT,
  PORT,
  MODE,
  FIREBASE,
  EMAIL,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT
};

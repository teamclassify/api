const admin = require("firebase-admin");
const { FIREBASE, DATABASE_URL } = require("./index");

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE),
  databaseURL: DATABASE_URL,
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };

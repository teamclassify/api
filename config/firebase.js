import admin from "firebase-admin";
import { FIREBASE, DATABASE_URL } from "./index";

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE),
  databaseURL: DATABASE_URL
});

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
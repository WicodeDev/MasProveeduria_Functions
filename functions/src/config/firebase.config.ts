import { FIREBASE_PROJECT_ID } from "@utils/dotenv";
import admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
import { initialize } from "fireorm";

const app = admin.initializeApp({
  credential: applicationDefault(),
  projectId: FIREBASE_PROJECT_ID,
  databaseURL: `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
  storageBucket: `${FIREBASE_PROJECT_ID}.appspot.com`,
});

const firestore = app.firestore();
const storage = app.storage();

export {
  app,
  firestore,
  initialize,
  storage,
}
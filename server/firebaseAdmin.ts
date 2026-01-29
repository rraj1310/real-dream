import admin from "firebase-admin";

let initialized = false;

function initFirebase() {
  if (initialized) return;

  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!base64) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 is missing");
  }

  const json = Buffer.from(base64, "base64").toString("utf-8");
  const serviceAccount = JSON.parse(json);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  initialized = true;
  console.log("Firebase Admin SDK initialized successfully");
}

export function initializeFirebaseAdmin() {
  initFirebase();
}

export async function verifyIdToken(token: string) {
  initFirebase();
  return admin.auth().verifyIdToken(token);
}
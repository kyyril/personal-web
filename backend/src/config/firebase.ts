import admin from 'firebase-admin';

let app: admin.app.App | null = null;

export const initializeFirebase = () => {
  if (app) {
    return app;
  }

  // Initialize Firebase Admin with service account from environment variables
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
  };

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return app;
};

export const getFirebaseAuth = () => {
  if (!app) {
    initializeFirebase();
  }
  return admin.auth();
};
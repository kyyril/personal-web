import admin from 'firebase-admin';

let app: admin.app.App | null = null;

export const initializeFirebase = () => {
  if (app) {
    return app;
  }

  // Initialize Firebase Admin with service account from environment variables
  const serviceAccount: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
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
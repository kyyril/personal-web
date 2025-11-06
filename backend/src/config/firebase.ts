import admin from 'firebase-admin';

let app: admin.app.App | null = null;

export const initializeFirebase = (): admin.app.App => {
  if (app) {
    console.log("Firebase app already initialized.");
    return app;
  }

  // Initialize Firebase Admin with service account from environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    console.error("Firebase environment variables are missing!");
    console.error("FIREBASE_PROJECT_ID:", projectId ? "Set" : "Not Set");
    console.error("FIREBASE_PRIVATE_KEY:", privateKey ? "Set" : "Not Set");
    console.error("FIREBASE_CLIENT_EMAIL:", clientEmail ? "Set" : "Not Set");
    throw new Error("Missing Firebase environment variables for Admin SDK initialization.");
  }

  const serviceAccount: admin.ServiceAccount = {
    projectId: projectId,
    privateKey: privateKey,
    clientEmail: clientEmail,
  };

  console.log("Initializing Firebase Admin SDK...");
  console.log("Service Account Project ID:", serviceAccount.projectId);
  console.log("Service Account Client Email:", serviceAccount.clientEmail);
  // Do NOT log the private key in production, but for debugging we can check its presence
  console.log("Service Account Private Key presence:", !!serviceAccount.privateKey);

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("Firebase Admin SDK initialized successfully.");
  return app;
};

export const getFirebaseAuth = () => {
  // Ensure Firebase is initialized before getting auth
  if (!app) {
    console.log("Firebase app not initialized, calling initializeFirebase from getFirebaseAuth.");
    initializeFirebase();
  }
  return admin.auth();
};
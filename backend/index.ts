import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { PrismaClient } from "./prisma/backend/src/generated/prisma";
import "dotenv/config";
console.log("Backend starting...");
console.log("FIREBASE_PROJECT_ID from .env:", process.env.FIREBASE_PROJECT_ID);
import { initializeFirebase } from "./src/config/firebase";
import { guestbookRoutes } from "./src/routes/guestbook";
import { replyRoutes } from "./src/routes/replies";
import { testRoutes } from "./src/routes/test";
import { userRoutes } from "./src/routes/user";
import { authMiddleware } from "./src/middleware/auth"; // Import authMiddleware

const prisma = new PrismaClient();

// Initialize Firebase
initializeFirebase();

const app = new Elysia()
  .onStart(() => {
    console.log("Elysia app starting...");
  })
  .onRequest(({ request }) => {
    console.log(`Incoming Request: ${request.method} ${request.url}`);
  })
  .use(
    cors({
      origin: [
        "http://localhost:3000", // Next.js dev
        "http://localhost:5173", // Vite dev
        "https://kyyril.vercel.app", // Production
        "https://kyyril.pages.dev", // Production
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  )
  .get("/", () => "Hello Elysia")
  .use(guestbookRoutes)
  .use(replyRoutes)
  .use(testRoutes)
  .use(userRoutes)
  .listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

console.log("Elysia app started. Registered routes:");
app.routes.forEach(route => {
  console.log(`- ${route.method} ${route.path}`);
});

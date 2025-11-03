import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { PrismaClient } from "./prisma/backend/src/generated/prisma";
import { initializeFirebase } from "./src/config/firebase";
import { guestbookRoutes } from "./src/routes/guestbook";
import { replyRoutes } from "./src/routes/replies";
import { testRoutes } from "./src/routes/test";

const prisma = new PrismaClient();

// Initialize Firebase
initializeFirebase();

const app = new Elysia()
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
  .listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

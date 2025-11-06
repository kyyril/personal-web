import { Elysia } from "elysia";
import { AuthenticatedUser } from "../middleware/auth"; // Keep this for the return type
import { getFirebaseAuth } from "../config/firebase";
import admin from 'firebase-admin';
import { PrismaClient } from "../../prisma/backend/src/generated/prisma";
import type { User } from "../../prisma/backend/src/generated/prisma";

const prisma = new PrismaClient(); // Initialize Prisma here

export const userRoutes = new Elysia()
  .group("/user", (app) =>
    app
      .post("/", async ({ request, set }) => {
        console.log("POST /user route handler triggered");
        const authHeader = request.headers.get("authorization");
        console.log("Authorization Header:", authHeader);

        if (!authHeader) {
          set.status = 401;
          console.error("Unauthorized: No auth header in /user route");
          throw new Error("Unauthorized");
        }

        const token = authHeader.split(" ")[1]; // Bearer TOKEN
        if (!token) {
          set.status = 401;
          console.error("Unauthorized: Token missing in /user route");
          throw new Error("Unauthorized: Token missing");
        }

        let decodedToken: admin.auth.DecodedIdToken;
        let user: User;

        try {
          decodedToken = await getFirebaseAuth().verifyIdToken(token);
          console.log("Token verified for UID in /user route:", decodedToken.uid);

          // Find or create user in database based on Firebase UID
          let existingUser = await prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid },
          });

          if (!existingUser) {
            console.log("User not found, creating new user for UID in /user route:", decodedToken.uid);
            // Create a new user if not found
            user = await prisma.user.create({
              data: {
                firebaseUid: decodedToken.uid,
                email: decodedToken.email,
                username:
                  decodedToken.name || decodedToken.email?.split("@")[0] || "Anonymous",
                avatarUrl: decodedToken.picture,
              },
            });
            console.log("New user created in /user route:", user);
          } else {
            console.log("User found in DB in /user route:", existingUser);
            user = existingUser;
          }
        } catch (error) {
          set.status = 401;
          console.error("Token verification failed in /user route:", error);
          throw new Error("Unauthorized: Invalid token");
        }
        return { message: "User processed successfully", user: user };
      })
  );
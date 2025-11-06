import { Elysia } from "elysia"; // Remove 'type Context'
import { getFirebaseAuth } from "../config/firebase";
import admin from 'firebase-admin';
import { PrismaClient } from "../../prisma/backend/src/generated/prisma";
import type { User } from "../../prisma/backend/src/generated/prisma"; // Import Prisma's User type

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  firebaseUid: string;
  prismaUser: User; // Use Prisma User type
}

// Augment Elysia's Context to include the 'user' property
declare module "elysia" {
  interface ElysiaContext { // Use ElysiaContext for augmentation
    user?: AuthenticatedUser;
  }
}

const prisma = new PrismaClient();

export const authMiddleware = new Elysia({ name: "auth" })
  .decorate("user", null as AuthenticatedUser | null) // Initialize user as null or AuthenticatedUser
  .derive(async ({ request, set }) => {
    console.log("Auth middleware triggered");
    const authHeader = request.headers.get("authorization");
    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
      set.status = 401;
      console.error("Unauthorized: No auth header");
      throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) {
      set.status = 401;
      console.error("Unauthorized: Token missing");
      throw new Error("Unauthorized: Token missing");
    }

    let decodedToken: admin.auth.DecodedIdToken;
    let user: User;

    try {
      decodedToken = await getFirebaseAuth().verifyIdToken(token);
      console.log("Token verified for UID:", decodedToken.uid);

      // Find or create user in database based on Firebase UID
      let existingUser = await prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid },
      });

      if (!existingUser) {
        console.log("User not found, creating new user for UID:", decodedToken.uid);
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
        console.log("New user created:", user);
      } else {
        console.log("User found in DB:", existingUser);
        user = existingUser;
      }
    } catch (error) {
      set.status = 401;
      console.error("Token verification failed:", error);
      throw new Error("Unauthorized: Invalid token");
    }

    return {
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
        firebaseUid: decodedToken.uid,
        prismaUser: user,
      } as AuthenticatedUser,
    };
  });

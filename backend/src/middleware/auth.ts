import { Elysia, type Context } from "elysia";
import { getFirebaseAuth } from "../config/firebase";
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

const prisma = new PrismaClient();

export const authMiddleware = new Elysia({ name: "auth" })
  .decorate("user", null as AuthenticatedUser | null) // Initialize user as null or AuthenticatedUser
  .derive(async ({ request, set }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      set.status = 401;
      throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) {
      set.status = 401;
      throw new Error("Unauthorized: Token missing");
    }
    const decodedToken = await getFirebaseAuth().verifyIdToken(token);

    // Find or create user in database based on Firebase UID
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
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

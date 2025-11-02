import { Elysia } from "elysia";
import { getFirebaseAuth } from "../config/firebase";
import { PrismaClient } from "../generated/prisma";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  firebaseUid: string;
  prismaUser: any; // Replace with Prisma User type
}

const prisma = new PrismaClient();

export const authMiddleware = new Elysia()
  .derive(async ({ request }) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1]; // Bearer TOKEN
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
          username: decodedToken.name || decodedToken.email?.split("@")[0] || "Anonymous",
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
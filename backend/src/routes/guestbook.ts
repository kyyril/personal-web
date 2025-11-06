import { Elysia } from "elysia";
import { PrismaClient } from "../../prisma/backend/src/generated/prisma";
import { getFirebaseAuth } from "../config/firebase";
import admin from 'firebase-admin';
import type { User } from "../../prisma/backend/src/generated/prisma"; // Import Prisma's User type

const prisma = new PrismaClient();

interface CreateGuestbookEntryBody {
  message: string;
}

interface UpdateGuestbookEntryBody {
  message: string;
}

export const guestbookRoutes = new Elysia()
  .group("/guestbook", (app) =>
    app
      // Public GET endpoint for testing
      .get("/", async () => {
        try {
          const entries = await prisma.guestbookEntry.findMany({
            include: {
              user: true,
              replies: {
                include: {
                  author: true,
                  user: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          });
          return entries;
        } catch (error) {
          console.error('Error fetching guestbook entries:', error);
          return new Response('Internal Server Error', { status: 500 });
        }
      })
      // Protected routes that require authentication
      .group("/protected", (app) =>
        app
          .post("/", async ({ request, set }) => {
            console.log("POST /guestbook/protected/ route handler triggered");
            const authHeader = request.headers.get("authorization");
            console.log("Authorization Header:", authHeader);

            if (!authHeader) {
              set.status = 401;
              console.error("Unauthorized: No auth header in /guestbook/protected/");
              throw new Error("Unauthorized");
            }

            const token = authHeader.split(" ")[1]; // Bearer TOKEN
            if (!token) {
              set.status = 401;
              console.error("Unauthorized: Token missing in /guestbook/protected/");
              throw new Error("Unauthorized: Token missing");
            }

            let decodedToken: admin.auth.DecodedIdToken;
            let prismaUser: User;

            try {
              decodedToken = await getFirebaseAuth().verifyIdToken(token);
              console.log("Token verified for UID in /guestbook/protected/:", decodedToken.uid);

              // Find or create user in database based on Firebase UID
              let existingUser = await prisma.user.findUnique({
                where: { firebaseUid: decodedToken.uid },
              });

              if (!existingUser) {
                console.log("User not found, creating new user for UID in /guestbook/protected/:", decodedToken.uid);
                // Create a new user if not found
                prismaUser = await prisma.user.create({
                  data: {
                    firebaseUid: decodedToken.uid,
                    email: decodedToken.email,
                    username:
                      decodedToken.name || decodedToken.email?.split("@")[0] || "Anonymous",
                    avatarUrl: decodedToken.picture,
                  },
                });
                console.log("New user created in /guestbook/protected/:", prismaUser);
              } else {
                console.log("User found in DB in /guestbook/protected/:", existingUser);
                prismaUser = existingUser;
              }
            } catch (error) {
              set.status = 401;
              console.error("Token verification failed in /guestbook/protected/:", error);
              throw new Error("Unauthorized: Invalid token");
            }

            const body = await request.json() as CreateGuestbookEntryBody;
            const { message } = body;

            const entry = await prisma.guestbookEntry.create({
              data: {
                message,
                userId: prismaUser.id,
              },
              include: {
                user: true,
              },
            });

            return entry;
          })
          .group("/:id", (app) =>
            app
              .get("/", async ({ params }) => {
                const entry = await prisma.guestbookEntry.findUnique({
                  where: { id: params.id },
                  include: {
                    user: true,
                    replies: {
                      include: {
                        author: true,
                        user: true,
                      },
                    },
                  },
                });

                if (!entry) {
                  return new Response("Not Found", { status: 404 });
                }

                return entry;
              })
              .put("/", async ({ params, request, set }) => {
                console.log("PUT /guestbook/protected/:id route handler triggered");
                const authHeader = request.headers.get("authorization");
                console.log("Authorization Header:", authHeader);

                if (!authHeader) {
                  set.status = 401;
                  console.error("Unauthorized: No auth header in PUT /guestbook/protected/:id");
                  throw new Error("Unauthorized");
                }

                const token = authHeader.split(" ")[1]; // Bearer TOKEN
                if (!token) {
                  set.status = 401;
                  console.error("Unauthorized: Token missing in PUT /guestbook/protected/:id");
                  throw new Error("Unauthorized: Token missing");
                }

                let decodedToken: admin.auth.DecodedIdToken;
                let prismaUser: User;

                try {
                  decodedToken = await getFirebaseAuth().verifyIdToken(token);
                  console.log("Token verified for UID in PUT /guestbook/protected/:id:", decodedToken.uid);

                  let existingUser = await prisma.user.findUnique({
                    where: { firebaseUid: decodedToken.uid },
                  });

                  if (!existingUser) {
                    set.status = 401;
                    console.error("User not found in DB for PUT /guestbook/protected/:id after token verification");
                    throw new Error("Unauthorized: User not found");
                  } else {
                    prismaUser = existingUser;
                  }
                } catch (error) {
                  set.status = 401;
                  console.error("Token verification failed in PUT /guestbook/protected/:id:", error);
                  throw new Error("Unauthorized: Invalid token");
                }

                const body = await request.json() as UpdateGuestbookEntryBody;
                const { message } = body;

                // Check if the user is the author of the entry
                const entry = await prisma.guestbookEntry.findUnique({
                  where: { id: params.id },
                });

                if (!entry) {
                  return new Response("Not Found", { status: 404 });
                }

                if (entry.userId !== prismaUser.id) {
                  return new Response("Forbidden", { status: 403 });
                }

                const updatedEntry = await prisma.guestbookEntry.update({
                  where: { id: params.id },
                  data: { message },
                  include: {
                    user: true,
                  },
                });

                return updatedEntry;
              })
              .delete("/", async ({ params, request, set }) => {
                console.log("DELETE /guestbook/protected/:id route handler triggered");
                const authHeader = request.headers.get("authorization");
                console.log("Authorization Header:", authHeader);

                if (!authHeader) {
                  set.status = 401;
                  console.error("Unauthorized: No auth header in DELETE /guestbook/protected/:id");
                  throw new Error("Unauthorized");
                }

                const token = authHeader.split(" ")[1]; // Bearer TOKEN
                if (!token) {
                  set.status = 401;
                  console.error("Unauthorized: Token missing in DELETE /guestbook/protected/:id");
                  throw new Error("Unauthorized: Token missing");
                }

                let decodedToken: admin.auth.DecodedIdToken;
                let prismaUser: User;

                try {
                  decodedToken = await getFirebaseAuth().verifyIdToken(token);
                  console.log("Token verified for UID in DELETE /guestbook/protected/:id:", decodedToken.uid);

                  let existingUser = await prisma.user.findUnique({
                    where: { firebaseUid: decodedToken.uid },
                  });

                  if (!existingUser) {
                    set.status = 401;
                    console.error("User not found in DB for DELETE /guestbook/protected/:id after token verification");
                    throw new Error("Unauthorized: User not found");
                  } else {
                    prismaUser = existingUser;
                  }
                } catch (error) {
                  set.status = 401;
                  console.error("Token verification failed in DELETE /guestbook/protected/:id:", error);
                  throw new Error("Unauthorized: Invalid token");
                }

                // Check if the user is the author of the entry
                const entry = await prisma.guestbookEntry.findUnique({
                  where: { id: params.id },
                });

                if (!entry) {
                  return new Response("Not Found", { status: 404 });
                }

                if (entry.userId !== prismaUser.id) {
                  return new Response("Forbidden", { status: 403 });
                }

                await prisma.guestbookEntry.delete({
                  where: { id: params.id },
                });

                return new Response(null, { status: 204 });
              })
          )
      )
  );
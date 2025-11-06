import { Elysia } from "elysia";
import { PrismaClient } from "../../prisma/backend/src/generated/prisma";
import { getFirebaseAuth } from "../config/firebase";
import admin from 'firebase-admin';
import type { User } from "../../prisma/backend/src/generated/prisma"; // Import Prisma's User type

const prisma = new PrismaClient();

interface CreateReplyBody {
  content: string;
  guestbookEntryId: string;
}

interface UpdateReplyBody {
  content: string;
}

export const replyRoutes = new Elysia()
  .group("/replies", (app) =>
    app
      // Create a new reply
      .post("/", async ({ request, set }) => {
        console.log("POST /replies route handler triggered");
        const authHeader = request.headers.get("authorization");
        console.log("Authorization Header:", authHeader);

        if (!authHeader) {
          set.status = 401;
          console.error("Unauthorized: No auth header in POST /replies");
          throw new Error("Unauthorized");
        }

        const token = authHeader.split(" ")[1]; // Bearer TOKEN
        if (!token) {
          set.status = 401;
          console.error("Unauthorized: Token missing in POST /replies");
          throw new Error("Unauthorized: Token missing");
        }

        let decodedToken: admin.auth.DecodedIdToken;
        let prismaUser: User;

        try {
          decodedToken = await getFirebaseAuth().verifyIdToken(token);
          console.log("Token verified for UID in POST /replies:", decodedToken.uid);

          // Find or create user in database based on Firebase UID
          let existingUser = await prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid },
          });

          if (!existingUser) {
            console.log("User not found, creating new user for UID in POST /replies:", decodedToken.uid);
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
            console.log("New user created in POST /replies:", prismaUser);
          } else {
            console.log("User found in DB in POST /replies:", existingUser);
            prismaUser = existingUser;
          }
        } catch (error) {
          set.status = 401;
          console.error("Token verification failed in POST /replies:", error);
          throw new Error("Unauthorized: Invalid token");
        }

        const body = await request.json() as CreateReplyBody;
        const { content, guestbookEntryId } = body;

        const reply = await prisma.reply.create({
          data: {
            content,
            guestbookEntryId,
            authorId: prismaUser.id,
            userId: prismaUser.id, // This is a bit confusing, but it's for the relationship
          },
          include: {
            author: true,
            user: true,
            guestbookEntry: true,
          },
        });

        return reply;
      })
      .group("/:id", (app) =>
        app
          // Get a single reply
          .get("/", async ({ params }) => {
            const reply = await prisma.reply.findUnique({
              where: { id: params.id },
              include: {
                author: true,
                user: true,
                guestbookEntry: true,
              },
            });

            if (!reply) {
              return new Response("Not Found", { status: 404 });
            }

            return reply;
          })
          // Update a reply
          .put("/", async ({ params, request, set }) => {
            console.log("PUT /replies/:id route handler triggered");
            const authHeader = request.headers.get("authorization");
            console.log("Authorization Header:", authHeader);

            if (!authHeader) {
              set.status = 401;
              console.error("Unauthorized: No auth header in PUT /replies/:id");
              throw new Error("Unauthorized");
            }

            const token = authHeader.split(" ")[1]; // Bearer TOKEN
            if (!token) {
              set.status = 401;
              console.error("Unauthorized: Token missing in PUT /replies/:id");
              throw new Error("Unauthorized: Token missing");
            }

            let decodedToken: admin.auth.DecodedIdToken;
            let prismaUser: User;

            try {
              decodedToken = await getFirebaseAuth().verifyIdToken(token);
              console.log("Token verified for UID in PUT /replies/:id:", decodedToken.uid);

              let existingUser = await prisma.user.findUnique({
                where: { firebaseUid: decodedToken.uid },
              });

              if (!existingUser) {
                set.status = 401;
                console.error("User not found in DB for PUT /replies/:id after token verification");
                throw new Error("Unauthorized: User not found");
              } else {
                prismaUser = existingUser;
              }
            } catch (error) {
              set.status = 401;
              console.error("Token verification failed in PUT /replies/:id:", error);
              throw new Error("Unauthorized: Invalid token");
            }

            const body = await request.json() as UpdateReplyBody;
            const { content } = body;

            // Check if the user is the author of the reply
            const reply = await prisma.reply.findUnique({
              where: { id: params.id },
            });

            if (!reply) {
              return new Response("Not Found", { status: 404 });
            }

            if (reply.authorId !== prismaUser.id) {
              return new Response("Forbidden", { status: 403 });
            }

            const updatedReply = await prisma.reply.update({
              where: { id: params.id },
              data: { content },
              include: {
                author: true,
                user: true,
                guestbookEntry: true,
              },
            });

            return updatedReply;
          })
          // Delete a reply
          .delete("/", async ({ params, request, set }) => {
            console.log("DELETE /replies/:id route handler triggered");
            const authHeader = request.headers.get("authorization");
            console.log("Authorization Header:", authHeader);

            if (!authHeader) {
              set.status = 401;
              console.error("Unauthorized: No auth header in DELETE /replies/:id");
              throw new Error("Unauthorized");
            }

            const token = authHeader.split(" ")[1]; // Bearer TOKEN
            if (!token) {
              set.status = 401;
              console.error("Unauthorized: Token missing in DELETE /replies/:id");
              throw new Error("Unauthorized: Token missing");
            }

            let decodedToken: admin.auth.DecodedIdToken;
            let prismaUser: User;

            try {
              decodedToken = await getFirebaseAuth().verifyIdToken(token);
              console.log("Token verified for UID in DELETE /replies/:id:", decodedToken.uid);

              let existingUser = await prisma.user.findUnique({
                where: { firebaseUid: decodedToken.uid },
              });

              if (!existingUser) {
                set.status = 401;
                console.error("User not found in DB for DELETE /replies/:id after token verification");
                throw new Error("Unauthorized: User not found");
              } else {
                prismaUser = existingUser;
              }
            } catch (error) {
              set.status = 401;
              console.error("Token verification failed in DELETE /replies/:id:", error);
              throw new Error("Unauthorized: Invalid token");
            }

            // Check if the user is the author of the reply
            const reply = await prisma.reply.findUnique({
              where: { id: params.id },
            });

            if (!reply) {
              return new Response("Not Found", { status: 404 });
            }

            if (reply.authorId !== prismaUser.id) {
              return new Response("Forbidden", { status: 403 });
            }

            await prisma.reply.delete({
              where: { id: params.id },
            });

            return new Response(null, { status: 204 });
          })
      )
  );
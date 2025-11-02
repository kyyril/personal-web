import { Elysia } from "elysia";
import { PrismaClient } from "../generated/prisma";
import { authMiddleware } from "../middleware/auth";

const prisma = new PrismaClient();

export const replyRoutes = new Elysia()
  .use(authMiddleware)
  .group("/replies", (app) =>
    app
      // Create a new reply
      .post("/", async ({ request, user }) => {
        const body = await request.json();
        const { content, guestbookEntryId } = body;

        const reply = await prisma.reply.create({
          data: {
            content,
            guestbookEntryId,
            authorId: user.prismaUser.id,
            userId: user.prismaUser.id, // This is a bit confusing, but it's for the relationship
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
          .put("/", async ({ params, request, user }) => {
            const body = await request.json();
            const { content } = body;

            // Check if the user is the author of the reply
            const reply = await prisma.reply.findUnique({
              where: { id: params.id },
            });

            if (!reply) {
              return new Response("Not Found", { status: 404 });
            }

            if (reply.authorId !== user.prismaUser.id) {
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
          .delete("/", async ({ params, user }) => {
            // Check if the user is the author of the reply
            const reply = await prisma.reply.findUnique({
              where: { id: params.id },
            });

            if (!reply) {
              return new Response("Not Found", { status: 404 });
            }

            if (reply.authorId !== user.prismaUser.id) {
              return new Response("Forbidden", { status: 403 });
            }

            await prisma.reply.delete({
              where: { id: params.id },
            });

            return new Response(null, { status: 204 });
          })
      )
  );
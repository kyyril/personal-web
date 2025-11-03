import { Elysia } from "elysia";
import { PrismaClient } from "../../prisma/backend/src/generated/prisma";
import { authMiddleware } from "../middleware/auth";
import type { AuthenticatedUser } from "../middleware/auth"; // Import as type

const prisma = new PrismaClient();

interface CreateReplyBody {
  content: string;
  guestbookEntryId: string;
}

interface UpdateReplyBody {
  content: string;
}

export const replyRoutes = new Elysia()
  .use(authMiddleware)
  .group("/replies", (app) =>
    app
      // Create a new reply
      .post("/", async ({ request, user }) => {
        const body = await request.json() as CreateReplyBody;
        const { content, guestbookEntryId } = body;

        // Ensure user is authenticated before proceeding
        if (!user) {
          return new Response("Unauthorized", { status: 401 });
        }

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
            const body = await request.json() as UpdateReplyBody;
            const { content } = body;

            // Ensure user is authenticated before proceeding
            if (!user) {
              return new Response("Unauthorized", { status: 401 });
            }

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
            // Ensure user is authenticated before proceeding
            if (!user) {
              return new Response("Unauthorized", { status: 401 });
            }

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
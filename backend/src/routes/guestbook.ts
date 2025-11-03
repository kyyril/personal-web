import { Elysia } from "elysia";
import { PrismaClient } from "../../prisma/backend/src/generated/prisma";
import { authMiddleware } from "../middleware/auth";
import type { AuthenticatedUser } from "../middleware/auth"; // Import as type

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
      .use(authMiddleware)
      .group("/auth", (app) =>
        app
          // Create a new guestbook entry
          .post("/", async ({ request, user }) => {
            const body = await request.json() as CreateGuestbookEntryBody;
            const { message } = body;

            // Ensure user is authenticated before proceeding
            if (!user) {
              return new Response("Unauthorized", { status: 401 });
            }

            const entry = await prisma.guestbookEntry.create({
              data: {
                message,
                userId: user.prismaUser.id,
              },
              include: {
                user: true,
              },
            });

            return entry;
          })
          .group("/:id", (app) =>
            app
              // Get a single guestbook entry
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
              // Update a guestbook entry
              .put("/", async ({ params, request, user }) => {
                const body = await request.json() as UpdateGuestbookEntryBody;
                const { message } = body;

                // Ensure user is authenticated before proceeding
                if (!user) {
                  return new Response("Unauthorized", { status: 401 });
                }

                // Check if the user is the author of the entry
                const entry = await prisma.guestbookEntry.findUnique({
                  where: { id: params.id },
                });

                if (!entry) {
                  return new Response("Not Found", { status: 404 });
                }

                if (entry.userId !== user.prismaUser.id) {
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
              // Delete a guestbook entry
              .delete("/", async ({ params, user }) => {
                // Ensure user is authenticated before proceeding
                if (!user) {
                  return new Response("Unauthorized", { status: 401 });
                }

                // Check if the user is the author of the entry
                const entry = await prisma.guestbookEntry.findUnique({
                  where: { id: params.id },
                });

                if (!entry) {
                  return new Response("Not Found", { status: 404 });
                }

                if (entry.userId !== user.prismaUser.id) {
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
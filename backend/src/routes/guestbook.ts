import { Elysia } from "elysia";
import { PrismaClient } from "../generated/prisma";
import { authMiddleware } from "../middleware/auth";

const prisma = new PrismaClient();

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
            const body = await request.json();
            const { message } = body;

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
                const body = await request.json();
                const { message } = body;

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
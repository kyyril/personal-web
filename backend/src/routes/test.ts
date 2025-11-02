import { Elysia } from "elysia";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const testRoutes = new Elysia()
  .get("/test/db", async () => {
    try {
      // Check connection and list tables
      const result = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      // Check user count
      const userCount = await prisma.user.count();
      
      // Check guestbook entry count  
      const guestbookCount = await prisma.guestbookEntry.count();
      
      return {
        tables: result,
        userCount,
        guestbookCount,
        databaseConnected: true
      };
    } catch (error) {
      console.error('Database test error:', error);
      return {
        error: error.message,
        databaseConnected: false
      };
    }
  })
  .get("/test/users", async () => {
    try {
      const users = await prisma.user.findMany({
        take: 5
      });
      return users;
    } catch (error) {
      console.error('Users test error:', error);
      return { error: error.message };
    }
  });
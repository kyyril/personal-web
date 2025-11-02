import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // 1. Update existing users to have UUIDs
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    // Check if user already has a UUID as ID (new schema)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isUuid = uuidRegex.test(user.id);
    
    if (!isUuid) {
      // Create a new UUID for this user
      const newUser = await prisma.user.create({
        data: {
          username: user.username,
          email: user.email,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
      
      // Update guestbook entries to reference the new user
      await prisma.guestbookEntry.updateMany({
        where: { userId: user.id },
        data: { userId: newUser.id },
      });
      
      console.log(`Migrated user: ${user.email || user.username} to new UUID: ${newUser.id}`);
    }
  }
  
  // 2. Create sample replies for each guestbook entry (optional)
  // This can be customized based on your needs
  const entries = await prisma.guestbookEntry.findMany({
    include: { replies: true },
  });
  
  for (const entry of entries) {
    // Skip if already has replies
    if (entry.replies.length > 0) continue;
    
    // Create a sample reply (you can customize this)
    const user = await prisma.user.findFirst();
    if (!user) continue;
    
    await prisma.reply.create({
      data: {
        content: 'This is a sample reply. You can delete this and add your own replies!',
        authorId: user.id,
        userId: user.id,
        guestbookEntryId: entry.id,
      },
    });
    
    console.log(`Added sample reply to entry: ${entry.id}`);
  }
  
  console.log('Migration completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
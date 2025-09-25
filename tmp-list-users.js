const { PrismaClient } = require('@prisma/client');
(async () => {
  const p = new PrismaClient();
  const users = await p.user.findMany({ select: { id: true, email: true, role: true, isActive: true } });
  console.log(users);
  await p.$disconnect();
})();
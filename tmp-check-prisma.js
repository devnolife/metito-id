const { PrismaClient } = require('@prisma/client');
(async () => {
  const p = new PrismaClient();
  console.log('Customer delegate exists:', typeof p.customer === 'object');
  console.log('Model names on p:', Object.keys(p));
  await p.$disconnect();
})();
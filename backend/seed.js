// seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create a Dummy Owner (so the stores have someone to belong to)
  const owner = await prisma.user.upsert({
    where: { email: 'owner@test.com' },
    update: {},
    create: {
      name: 'Test Owner',
      email: 'owner@test.com',
      passwordHash: '$2a$10$hashedpasswordplaceholder', // Dummy hash
      role: 'OWNER',
      address: '101 Market Street'
    },
  });

  console.log(`👤 Using Owner: ${owner.email} (ID: ${owner.id})`);

  // 2. Define Store Data
  const stores = [
    {
      name: 'Tech Galaxy Electronics',
      email: 'contact@techgalaxy.com',
      address: '123 Silicon Ave, San Francisco, CA',
      ownerId: owner.id,
    },
    {
      name: 'Green Leaf Organic Market',
      email: 'hello@greenleafmarket.com',
      address: '456 Maple Drive, Portland, OR',
      ownerId: owner.id,
    },
    {
      name: 'The Rusty Anchor Coffee',
      email: 'brew@rustyanchor.com',
      address: '789 Harbor Blvd, Seattle, WA',
      ownerId: null, // No owner
    },
    {
      name: 'Urban Threads Boutique',
      email: 'support@urbanthreads.com',
      address: '101 Fashion Row, New York, NY',
      ownerId: owner.id,
    },
    {
      name: 'Quick Fix Auto Repair',
      email: 'service@quickfixauto.com',
      address: '202 Motorway Ln, Detroit, MI',
      ownerId: null,
    }
  ];

  // 3. Insert Stores into Database
  for (const store of stores) {
    // upsert ensures we don't create duplicates if you run this twice
    await prisma.store.upsert({
      where: { email: store.email }, 
      update: {},
      create: store,
    });
  }

  console.log(`✅ Successfully added ${stores.length} stores to MongoDB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// prisma/seedAdmin.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Role } = require("@prisma/client");
const prisma = require("../src/config/prisma");

async function main() {
  const adminEmail = "admin@example.com";
  const adminPassword = "Admin@1234"; // meets our password rules
  const adminName = "Default System Administrator User";

  console.log("Seeding admin user if not exists...");

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log("Admin user already exists with email:", adminEmail);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      address: "Admin default address",
    },
  });

  console.log("Admin user created:");
  console.log("  Email:", adminEmail);
  console.log("  Password:", adminPassword);
}

main()
  .catch((err) => {
    console.error("Error seeding admin:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Load environment variables natively in Node.js
if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile();
}

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!username || !plainPassword) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD environment variables must be defined in .env');
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  console.log('Seeding admin user...');
  
  const admin = await prisma.adminUser.upsert({
    where: { username },
    update: {
      password: hashedPassword,
    },
    create: {
      username,
      password: hashedPassword,
    },
  });

  console.log('Admin user seeded/updated successfully:', admin.username);

  console.log('Seeding contact details...');
  const contact = await prisma.contactDetails.findFirst();
  
  const defaultContact = {
    phone: "+91 99959 05111",
    email: "parklegalkochi@gmail.com",
    address: "1st Floor, Johns Corner Building, Judges Ave, GCDA LIG Colony, Ernakulam North, Kathrikadavu, Kaloor, Kochi, Kerala 682017",
    directionsLink: "https://share.google/RA8iNjjGzmtfZquIz",
    directContacts: [
      { name: "Aravind", phone: "+91 8714812848" },
      { name: "Manu", phone: "+91 9400897108" }
    ]
  };

  if (contact) {
    await prisma.contactDetails.update({
      where: { id: contact.id },
      data: defaultContact
    });
    console.log('Contact details updated successfully.');
  } else {
    await prisma.contactDetails.create({
      data: defaultContact
    });
    console.log('Contact details created successfully.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

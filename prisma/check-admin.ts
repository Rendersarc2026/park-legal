import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.adminUser.findFirst();
  if (admin) {
    console.log('Admin user found:', admin.username);
    console.log('Password length:', admin.password.length);
    console.log('Is Active:', admin.isActive);
    if (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$')) {
      console.log('Password appears to be hashed (bcrypt).');
    } else {
      console.log('WARNING: Password appears to be plain text!');
    }
  } else {
    console.log('No admin user found in database.');
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

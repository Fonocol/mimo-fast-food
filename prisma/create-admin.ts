import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("MimoPass2026!", 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mimo.com' },
    update: {},
    create: {
      email: 'admin@mimo.com',
      name: 'Mimo Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log("✅ Compte Admin créé :", admin.email)
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// 1. On récupère l'URL de Neon
const connectionString = `${process.env.DATABASE_URL}`

// 2. On configure le pool de connexions
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool as any)

// 3. Fonction qui crée l'instance Prisma avec l'adapter
const prismaClientSingleton = () => {
  return new PrismaClient({ adapter: adapter as any })
}

// 4. On utilise globalThis pour stocker l'instance et éviter les doublons
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
// prisma/seed.ts
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter: adapter as any })

async function main() {
  console.log("🚀 Nettoyage et injection du menu complet Mimo...")

  // Nettoyage pour éviter les doublons
  await prisma.orderProduct.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.specialPlate.deleteMany({})

  // 1. CRÉATION DES CATÉGORIES
  const cats = {
    breakfast: await prisma.category.create({ data: { name: "PETIT DEJEUNER" } }),
    snacks: await prisma.category.create({ data: { name: "SNACKS & POULET PANÉ" } }),
    combos: await prisma.category.create({ data: { name: "MENUS COMBOS" } }),
    burgers: await prisma.category.create({ data: { name: "MENUS BURGER CLASSIQUES" } }),
    cuisine: await prisma.category.create({ data: { name: "PLATS SPÉCIAUX (CUISINE)" } }),
    family: await prisma.category.create({ data: { name: "MENU FAMILIAL & ENTIER" } }),
    drinks: await prisma.category.create({ data: { name: "DESSERTS & BOISSONS" } }),
  }

  // 2. INJECTION DES PRODUITS
  await prisma.product.createMany({
    data: [
      // Petit Déjeuner
      { name: "Thé au lait", price: 300, categoryId: cats.breakfast.id },
      { name: "Oeuf simple", price: 200, categoryId: cats.breakfast.id },
      { name: "1 Oeuf Spaghetti", price: 300, categoryId: cats.breakfast.id },
      { name: "Spaghetti Sauté", price: 600, categoryId: cats.breakfast.id },
      { name: "Purée d'avocat", price: 700, categoryId: cats.breakfast.id },
      
      // Snacks
      { name: "Frites de pommes", price: 500, categoryId: cats.snacks.id },
      { name: "Burger Poulet", price: 1000, categoryId: cats.snacks.id },
      { name: "Burger Viande", price: 1000, categoryId: cats.snacks.id },
      { name: "1 Dos de poulet pané", price: 1500, categoryId: cats.snacks.id },

      // Combos
      { name: "Boisson au lait + 1 Dos + Frites", price: 2000, categoryId: cats.combos.id },
      { name: "Boisson au lait + 1 Burger", price: 2000, categoryId: cats.combos.id },

      // Burger Classiques
      { name: "1 Burger + 1 Pepsi/Coca", price: 1500, categoryId: cats.burgers.id },
      { name: "1 Burger + 1 Pepsi/Coca + Frites", price: 2000, categoryId: cats.burgers.id },

      // Plats Cuisine
      { name: "Poulet Rôti + Complément", price: 1300, categoryId: cats.cuisine.id },
      { name: "Sauce Basquaise Poulet + Riz", price: 1500, categoryId: cats.cuisine.id },
      { name: "Poisson à la poêle + Frites", price: 2000, categoryId: cats.cuisine.id },
      
      // Boissons
      { name: "Cupcake", price: 50, categoryId: cats.drinks.id },
      { name: "Jus Naturels 0.5L", price: 500, categoryId: cats.drinks.id },
      { name: "Canette", price: 1000, categoryId: cats.drinks.id },
    ]
  })

  // 3. PLATS CHAUDS DU JOUR (Le Semainier)
  await prisma.specialPlate.createMany({
    data: [
      { day: "LUNDI", dishName: "Poulet DG / Ndole ROYAL Viande/Poisson", priceSmall: 1000, priceLarge: 1500 },
      { day: "MARDI", dishName: "Moongo de Machoiron / Viande Boeuf / Rôti de porc", priceSmall: 1000, priceLarge: 1500 },
      { day: "MERCREDI", dishName: "Okock salé / Pommes sautées Viande/Poulet", priceSmall: 1000, priceLarge: 1500 },
      { day: "JEUDI", dishName: "Eru Fufu/Tapioca / Sauté de gésier de poulet", priceSmall: 1000, priceLarge: 1500 },
      { day: "VENDREDI", dishName: "Légumes sautés / Pommes pilées", priceSmall: 1000, priceLarge: 1500 },
      { day: "SAMEDI", dishName: "Haricots blancs Viande/Poulet / Eru Fufu/Tapioca", priceSmall: 1000, priceLarge: 1500 },
      { day: "DIMANCHE", dishName: "Bouillon de viande ou poisson / Ndole Royal", priceSmall: 1000, priceLarge: 1500 },
    ]
  })

  console.log("✅ Menu injecté avec succès ! Douala est prêt à manger.")
}

main()
  .then(async () => { await prisma.$disconnect(); await pool.end() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); await pool.end(); process.exit(1) })
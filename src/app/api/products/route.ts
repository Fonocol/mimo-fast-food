// src/app/api/products/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 })
  }
}
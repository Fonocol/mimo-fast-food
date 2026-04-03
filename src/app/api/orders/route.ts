import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  const { customerPhone, deliveryAddress, items } = await req.json()

  if (!customerPhone || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Données de commande invalides' }, { status: 400 })
  }

  const userId = session?.user?.id || null

  type ItemPayload = { productId: string; quantity: number }
  const productIds = items.map((item: ItemPayload) => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isAvailable: true }
  })

  if (products.length !== items.length) {
    return NextResponse.json({ error: 'Certains produits ne sont pas disponibles' }, { status: 400 })
  }

  let totalAmount = 0
  const orderProducts = items.map((item: ItemPayload) => {
    const product = products.find((p) => p.id === item.productId)
    const quantity = Number(item.quantity || 1)
    if (!product || quantity < 1) throw new Error('Article invalide')
    totalAmount += product.price * quantity
    return {
      productId: product.id,
      quantity
    }
  })

  const order = await prisma.order.create({
    data: {
      customerPhone,
      deliveryAddress,
      totalAmount,
      userId,
      status: 'PENDING',
      products: {
        create: orderProducts.map((op) => ({ productId: op.productId, quantity: op.quantity }))
      }
    },
    include: { products: true }
  })

  return NextResponse.json({ success: true, order })
}

export async function GET() {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const sessionRole = (session?.user as { role?: string | undefined } | null)?.role
  if (sessionRole === 'ADMIN') {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        products: { include: { product: true } }
      }
    })
    return NextResponse.json({ orders })
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: 'desc' },
    include: {
      products: { include: { product: true } }
    }
  })

  return NextResponse.json({ orders })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  const sessionRole = (session?.user as { role?: string | undefined } | null)?.role
  if (!session || sessionRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { orderId, status } = await req.json()
  if (!orderId || !['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status }
  })

  return NextResponse.json({ success: true, order })
}

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: session.user?.id },
    include: { products: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  })

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      'PENDING': 'bg-yellow-100 text-yellow-700',
      'CONFIRMED': 'bg-blue-100 text-blue-700',
      'DELIVERED': 'bg-green-100 text-green-700',
      'CANCELLED': 'bg-red-100 text-red-700'
    }
    const labels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'CONFIRMED': 'Confirmée',
      'DELIVERED': 'Livrée',
      'CANCELLED': 'Annulée'
    }
    return { color: colors[status] || 'bg-gray-100 text-gray-700', label: labels[status] || status }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-3 sm:px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-orange-600 mb-2">Mes Commandes</h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Connecté en tant que <strong>{session.user?.email}</strong></p>

      <div className="space-y-3 sm:space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-orange-200 rounded-2xl p-6 sm:p-8 text-center">
            <p className="text-gray-500 text-base sm:text-lg mb-3">Vous n&apos;avez encore passé aucune commande</p>
            <Link href="/" className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
              Commencer une commande
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const badge = getStatusBadge(order.status)
            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4">
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="font-black text-base sm:text-lg text-gray-800">Commande #{order.id.slice(0, 8)}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('fr-FR')}</p>
                  </div>
                  <p className="text-right font-black text-base sm:text-lg md:text-xl text-orange-600 sm:whitespace-nowrap">{order.totalAmount} FCFA</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Articles :</p>
                  <ul className="space-y-1">
                    {order.products.map((item) => (
                      <li key={item.id} className="text-xs sm:text-sm text-gray-700">
                        • {item.quantity}× {item.product?.name || 'Produit supprimé'}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs sm:text-sm text-gray-600">
                  <span className="font-semibold">Téléphone :</span> {order.customerPhone}
                  {order.deliveryAddress && (
                    <>
                      <br />
                      <span className="font-semibold">Adresse :</span> {order.deliveryAddress}
                    </>
                  )}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

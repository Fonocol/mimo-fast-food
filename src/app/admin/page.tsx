import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function createProduct(formData: FormData) {
  'use server'
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = Number(formData.get('price'))
  const categoryId = formData.get('categoryId') as string
  const imageUrl = formData.get('imageUrl') as string
  const isAvailable = formData.get('isAvailable') === 'on'
  const isNew = formData.get('isNew') === 'on'

  if (!name || !price || !categoryId) return

  await prisma.product.create({
    data: { name, description, price, categoryId, imageUrl, isAvailable, isNew }
  })
}

async function updateProductAvailability(formData: FormData) {
  'use server'
  const productId = formData.get('productId') as string
  const isAvailable = formData.get('isAvailable') === 'true'
  await prisma.product.update({ where: { id: productId }, data: { isAvailable } })
}

async function deleteProduct(formData: FormData) {
  'use server'
  const productId = formData.get('productId') as string
  await prisma.product.delete({ where: { id: productId } })
}

async function createCategory(formData: FormData) {
  'use server'
  const name = (formData.get('name') as string)?.trim()
  if (!name) return
  await prisma.category.upsert({ where: { name }, update: {}, create: { name } })
}

async function changeOrderStatus(formData: FormData) {
  'use server'
  const orderId = formData.get('orderId') as string
  const status = formData.get('status') as string
  if (!['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].includes(status)) return
  await prisma.order.update({ where: { id: orderId }, data: { status: status as import('@prisma/client').OrderStatus } })
}

export default async function AdminPage() {
  const session = await auth()
  const userRole = (session?.user as { role?: string } | null)?.role
  if (!session || userRole !== 'ADMIN') redirect('/')

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: 'asc' }
  })
  const orders = await prisma.order.findMany({
    include: { user: true, products: { include: { product: true } } },
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
      'CONFIRMED': 'Confirmee',
      'DELIVERED': 'Livree',
      'CANCELLED': 'Annulee'
    }
    return { color: colors[status] || 'bg-gray-100 text-gray-700', label: labels[status] || status }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-orange-600 mb-2">Administration</h1>
          <p className="text-gray-600">Gerez vos produits et commandes</p>
        </div>

        {/* SECTION 1: GESTION DES PRODUITS */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Produits</h2>
            <Link 
              href="/admin/specials" 
              className="text-sm bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition w-fit"
            >
              Plats du jour
            </Link>
          </div>

          {/* Creer categorie */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Nouvelle Categorie</h3>
            <form action={createCategory} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input 
                name="name" 
                type="text" 
                placeholder="Nom de la categorie" 
                className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                required 
              />
              <button type="submit" className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg py-3 font-semibold text-sm transition col-span-1 md:col-span-2">
                Ajouter
              </button>
            </form>
          </div>

          {/* Creer produit */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Nouveau Produit</h3>
            <form action={createProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                name="name" 
                type="text" 
                placeholder="Nom du produit" 
                className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                required 
              />
              <input 
                name="price" 
                type="number" 
                placeholder="Prix FCFA" 
                className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                required 
              />
              <select 
                name="categoryId" 
                className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                required
              >
                <option value="">Choisir categorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input 
                name="imageUrl" 
                type="text" 
                placeholder="URL image" 
                className="border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
              <textarea 
                name="description" 
                placeholder="Description" 
                rows={3}
                className="md:col-span-2 border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <input name="isAvailable" type="checkbox" defaultChecked className="w-4 h-4 rounded cursor-pointer" />
                <span>Disponible</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <input name="isNew" type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                <span>Nouveau</span>
              </label>
              <button type="submit" className="md:col-span-2 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-bold text-sm transition">
                Ajouter le produit
              </button>
            </form>
          </div>

          {/* Liste produits */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Produits</h3>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nom</th>
                  <th className="px-4 py-3 font-semibold">Categorie</th>
                  <th className="px-4 py-3 font-semibold">Prix</th>
                  <th className="px-4 py-3 font-semibold">Dispo</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3">{p.category?.name}</td>
                    <td className="px-4 py-3 font-semibold">{p.price} FCFA</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {p.isAvailable ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <Link 
                        href={`/admin/products/${p.id}/edit`} 
                        className="text-blue-600 hover:text-blue-700 font-semibold text-xs whitespace-nowrap"
                      >
                        Modifier
                      </Link>
                      <form action={updateProductAvailability} className="inline">
                        <input type="hidden" name="productId" value={p.id} />
                        <input type="hidden" name="isAvailable" value={!p.isAvailable ? 'true' : 'false'} />
                        <button type="submit" className="text-purple-600 hover:text-purple-700 font-semibold text-xs whitespace-nowrap">
                          {p.isAvailable ? 'Masquer' : 'Afficher'}
                        </button>
                      </form>
                      <form action={deleteProduct} className="inline">
                        <input type="hidden" name="productId" value={p.id} />
                        <button type="submit" className="text-red-600 hover:text-red-700 font-semibold text-xs whitespace-nowrap">
                          Supprimer
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: GESTION DES COMMANDES */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Commandes</h2>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total', value: orders.length, color: 'bg-blue-100 text-blue-700' },
              { label: 'En attente', value: orders.filter(o => o.status === 'PENDING').length, color: 'bg-yellow-100 text-yellow-700' },
              { label: 'Confirmees', value: orders.filter(o => o.status === 'CONFIRMED').length, color: 'bg-purple-100 text-purple-700' },
              { label: 'Livrees', value: orders.filter(o => o.status === 'DELIVERED').length, color: 'bg-green-100 text-green-700' }
            ].map((stat, idx) => (
              <div key={idx} className={`${stat.color} rounded-lg p-4 text-center`}>
                <p className="text-2xl md:text-3xl font-black">{stat.value}</p>
                <p className="text-xs font-semibold mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Commandes list */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Dernieres Commandes</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {orders.slice(0, 20).map((order) => {
                const badge = getStatusBadge(order.status)
                return (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-3">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-semibold text-gray-800">#{order.id.slice(0, 8)}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{order.customerPhone}</p>
                      </div>
                      <span className="font-bold text-orange-600 text-lg">{order.totalAmount} FCFA</span>
                    </div>

                    <div className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                      Articles: {order.products.map(p => `${p.quantity}x ${p.product?.name || 'Produit'}`).join(' | ')}
                    </div>

                    <form action={changeOrderStatus} className="flex flex-col md:flex-row items-end gap-2">
                      <input type="hidden" name="orderId" value={order.id} />
                      <select 
                        name="status" 
                        defaultValue={order.status} 
                        className="border border-gray-200 p-2 rounded text-xs focus:ring-1 focus:ring-orange-500 outline-none flex-grow"
                      >
                        <option value="PENDING">En attente</option>
                        <option value="CONFIRMED">Confirmee</option>
                        <option value="DELIVERED">Livree</option>
                        <option value="CANCELLED">Annulee</option>
                      </select>
                      <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold text-xs transition whitespace-nowrap w-full md:w-fit">
                        Appliquer
                      </button>
                    </form>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

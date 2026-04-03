import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function updateProduct(formData: FormData) {
  'use server'
  const productId = formData.get('productId') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = Number(formData.get('price'))
  const categoryId = formData.get('categoryId') as string
  const imageUrl = formData.get('imageUrl') as string
  const isAvailable = formData.get('isAvailable') === 'on'
  const isNew = formData.get('isNew') === 'on'

  if (!name || !price || !categoryId) return

  await prisma.product.update({
    where: { id: productId },
    data: { name, description, price, categoryId, imageUrl, isAvailable, isNew }
  })
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const userRole = (session?.user as { role?: string } | null)?.role
  if (!session || userRole !== 'ADMIN') redirect('/')

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  })

  if (!product) redirect('/admin')

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Link href="/admin" className="text-orange-600 font-semibold hover:underline">
          ← Retour au tableau de bord
        </Link>
      </div>

      <h1 className="text-4xl font-black text-orange-600 mb-6">Modifier le produit</h1>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <form action={updateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="hidden" name="productId" value={product.id} />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
            <input 
              name="name" 
              type="text" 
              defaultValue={product.name}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (FCFA)</label>
            <input 
              name="price" 
              type="number" 
              defaultValue={product.price}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
            <select 
              name="categoryId" 
              defaultValue={product.categoryId}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
            <input 
              name="imageUrl" 
              type="text" 
              defaultValue={product.imageUrl || ''}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea 
              name="description" 
              defaultValue={product.description || ''}
              rows={4}
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input name="isAvailable" type="checkbox" defaultChecked={product.isAvailable} className="w-4 h-4 rounded" />
              <span className="text-sm font-semibold text-gray-700">Disponible</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input name="isNew" type="checkbox" defaultChecked={product.isNew} className="w-4 h-4 rounded" />
              <span className="text-sm font-semibold text-gray-700">Nouveau produit</span>
            </label>
          </div>

          <button type="submit" className="md:col-span-2 bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition">
            Mettre à jour le produit
          </button>
        </form>
      </div>
    </div>
  )
}

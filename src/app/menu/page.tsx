// src/app/menu/page.tsx
import prisma from '@/lib/prisma'
import MenuContent from '../components/MenuContent'

export default async function MenuPage() {
  const categories = await prisma.category.findMany({
    include: { products: true }
  })

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-900 italic">LA CARTE MIMO</h1>
          <p className="text-gray-500">Faites votre choix parmi nos délices</p>
        </header>

        {/* Le composant interactif */}
        <MenuContent initialCategories={categories} />
      </div>
    </div>
  )
}
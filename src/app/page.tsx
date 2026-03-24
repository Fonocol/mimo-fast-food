// src/app/page.tsx
import prisma from '@/lib/prisma'
import ProductCard from './components/ProductCard';

export default async function HomePage() {
  const categories = await prisma.category.findMany({ include: { products: true } })
  
  // On récupère le plat du jour (exemple pour LUNDI)
  const today = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(new Date()).toUpperCase();
  const specialDay = await prisma.specialPlate.findFirst({ where: { day: today } });

  return (
    <div className="pb-20">
      {/* Hero Section / Vitrine */}
      <section className="relative h-[400px] flex items-center justify-center bg-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000')] bg-cover bg-center"></div>
        <div className="relative z-10 text-center px-4">
          <h2 className="text-5xl md:text-7xl font-black mb-4 drop-shadow-lg">MIMO FAST FOOD</h2>
          <p className="text-xl md:text-2xl font-light">Le meilleur de la street-food à Douala</p>
          <button className="mt-8 bg-white text-orange-600 px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition">
            Voir le menu
          </button>
        </div>
      </section>

      {/* SECTION : PLAT DU JOUR (Mise en avant) */}
      {specialDay && (
        <section className="max-w-4xl mx-auto -mt-16 relative z-20 px-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-[calc(1.5rem-1px)] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-grow">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  🔥 Spécial {today}
                </span>
                <h3 className="text-3xl font-black text-gray-900 mt-2">{specialDay.dishName}</h3>
                <p className="text-gray-500 mt-2">Disponible aujourd'hui uniquement. Ne ratez pas ça !</p>
                <div className="mt-4 flex gap-4">
                  <span className="text-2xl font-bold text-orange-600">{specialDay.priceSmall} <small className="text-sm">FCFA</small></span>
                  <span className="text-gray-300 text-2xl">|</span>
                  <span className="text-2xl font-bold text-orange-600">{specialDay.priceLarge} <small className="text-sm">FCFA</small></span>
                </div>
              </div>
              <button className="whitespace-nowrap bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-200">
                Commander le plat
              </button>
            </div>
          </div>
        </section>
      )}

      {/* LISTE DES PRODUITS PAR CATÉGORIE */}
      <main className="max-w-7xl mx-auto p-4 mt-12">
        {categories.map((category) => (
          <section key={category.id} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
               <h2 className="text-3xl font-black text-gray-800">{category.name}</h2>
               <div className="h-1 flex-grow bg-gray-100 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
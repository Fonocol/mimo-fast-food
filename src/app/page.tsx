// src/app/page.tsx
import prisma from '@/lib/prisma'
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import SpecialPlateClientSection from './components/SpecialPlateClientSection';


export default async function HomePage() {
  const categories = await prisma.category.findMany({ include: { products: true } })
  
  // On récupère le plat du jour (exemple pour LUNDI)
  const today = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(new Date()).toUpperCase();
  const specialDay = await prisma.specialPlate.findFirst({ where: { day: today } });

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[350px] md:h-[450px] flex items-center justify-center bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000')] bg-cover bg-center"></div>
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-black mb-3 drop-shadow-lg">MIMO FAST FOOD</h2>
          <p className="text-lg md:text-xl font-light drop-shadow">La meilleure street-food a Douala</p>
        </div>
      </section>

      {/* Special Plate Section */}
      {specialDay && <SpecialPlateClientSection special={specialDay} today={today} />}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 mt-8 md:mt-12">
        <Cart />

        {categories.map((category) => (
          <section key={category.id} className="mb-12">
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800">{category.name}</h2>
              <div className="h-1 flex-grow bg-gradient-to-r from-orange-300 to-transparent rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
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
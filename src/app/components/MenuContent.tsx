// src/components/MenuContent.tsx
'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

export default function MenuContent({ initialCategories }: { initialCategories: any[] }) {
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  // Détecter le scroll pour changer le style de la barre sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredCategories = initialCategories.map(cat => ({
    ...cat,
    products: cat.products.filter((p: any) => 
      (activeTab === 'ALL' || cat.name === activeTab) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.products.length > 0)

  return (
    <div className="relative">
      {/* Barre de Recherche & Filtres - avec effet de blur au scroll */}
      <div className={`sticky top-[64px] z-30 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-gray-50'
      } pt-4 pb-6 border-b border-gray-100`}>
        <div className="space-y-6">
          {/* Barre de recherche améliorée */}
          <div className="relative max-w-md mx-auto md:mx-0">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input 
              type="text"
              placeholder="Rechercher un délice..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Catégories avec scroll horizontal amélioré */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setActiveTab('ALL')}
              className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-300 ${
                activeTab === 'ALL' 
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg transform scale-105' 
                  : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              🍽️ Tout le menu
            </button>
            {initialCategories.map((cat, idx) => (
              <button 
                key={cat.id}
                onClick={() => setActiveTab(cat.name)}
                className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-300 ${
                  activeTab === cat.name 
                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg transform scale-105' 
                    : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-300 hover:shadow-md'
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {getCategoryIcon(cat.name)} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rendu des produits avec animations */}
      <div className="mt-8">
        {filteredCategories.length > 0 ? (
          <div className="space-y-16">
            {filteredCategories.map((cat, catIdx) => (
              <section key={cat.id} className="fade-in-up" style={{ animationDelay: `${catIdx * 0.1}s` }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center text-2xl">
                    {getCategoryIcon(cat.name)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-800">{cat.name}</h2>
                    <p className="text-sm text-gray-500">{cat.products.length} délices disponibles</p>
                  </div>
                  <div className="h-px flex-grow bg-gradient-to-r from-gray-200 to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {cat.products.map((p: any, productIdx: number) => (
                    <div 
                      key={p.id} 
                      className="fade-in-up" 
                      style={{ animationDelay: `${(catIdx * 0.1) + (productIdx * 0.05)}s` }}
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
            <div className="text-8xl mb-4">x</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun résultat</h3>
            <p className="text-gray-400 font-medium">
              Nous n'avons pas trouvé de produit correspondant à "{searchQuery}"
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 transition-all"
            >
              Voir tout le menu
            </button>
          </div>
        )}
      </div>
      
      {/* Bouton flottant pour remonter en haut */}
      {filteredCategories.length > 0 && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-orange-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-orange-700 transition-all hover:scale-110 flex items-center justify-center z-50"
        >
          ↑
        </button>
      )}
    </div>
  )
}

// Helper pour les icônes de catégories
function getCategoryIcon(categoryName: string): string {
  const icons: { [key: string]: string } = {
    'Burgers': '🍔',
    'Pizzas': '🍕',
    'Salades': '🥗',
    'Desserts': '🍰',
    'Boissons': '🥤',
    'Frites': '🍟',
    'Sandwichs': '🥪',
    'Menu enfant': '👶'
  }
  return icons[categoryName] || '🍽️'
}
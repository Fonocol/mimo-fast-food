// src/components/ProductCard.tsx
export default function ProductCard({ product }: { product: any }) {
    console.log(product)
  return (
    <div className="relative group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col p-3">
      
      {/* 1. RUBAN "NEW" (Visuel uniquement) */}
      {product.isNew && (
        <div className="absolute top-0 left-0 z-10">
          <div className="bg-red-500 text-white text-[10px] font-black px-8 py-1.5 -rotate-45 -translate-x-8 translate-y-3 shadow-md uppercase tracking-tighter">
            New
          </div>
        </div>
      )}

      {/* 2. ZONE IMAGE + TAMPON "SOLD OUT" */}
      <div className={`relative h-48 w-full rounded-2xl flex items-center justify-center p-4 transition-all duration-300 ${!product.isAvailable ? 'bg-gray-50' : 'bg-orange-50/50'}`}>
        <img 
          src={product.imageUrl || "/burger-placeholder.png"} 
          alt={product.name} 
          className={`object-contain h-full w-full transition-all duration-500 ${!product.isAvailable ? 'grayscale opacity-50 blur-[1px]' : 'group-hover:scale-110'}`} 
        />
        
        {/* TAMPON SOLD OUT (Visuel uniquement) */}
        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-4 border-red-600 text-red-600 font-black px-5 py-2 rounded-xl uppercase rotate-12 bg-white/90 scale-125 shadow-2xl">
              Sold Out
            </div>
          </div>
        )}
      </div>

      {/* 3. CONTENU (Texte) */}
      <div className="p-4 flex flex-col flex-grow text-center">
        <h3 className="font-bold text-lg text-gray-800 mb-1 capitalize line-clamp-1">{product.name.toLowerCase()}</h3>
        
        {/* Prix toujours visible */}
        <p className="mt-1 text-xl font-black text-orange-600">{product.price} <small className="text-[10px]">FCFA</small></p>
        
        <p className="mt-3 text-gray-400 text-xs line-clamp-2">
          {product.description || "Recette authentique Mimo Fast Food, préparée avec des produits frais."}
        </p>
      </div>

      {/* 4. ZONE ACTION (Hybride) */}
      <div className="p-3 pt-0 mt-auto">
        {!product.isAvailable ? (
          // Bouton désactivé pour SOLD OUT
          <div className="w-full bg-gray-100 text-gray-400 py-3 rounded-xl font-bold text-center text-sm border border-gray-100 cursor-not-allowed">
            Indisponible
          </div>
        ) : (
          // Bouton d'action pour les produits disponibles
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-100 hover:shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-2">
            Ajouter au panier 
            <span className="text-xs">🛒</span>
          </button>
        )}
      </div>
    </div>
  )
}
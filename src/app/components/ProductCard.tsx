// src/components/ProductCard.tsx
"use client"

import { useState } from "react"
import { ProductDetailModal } from "./ProductDetailModal"

type ProductType = {
  id: string
  name: string
  price: number
  description?: string | null
  imageUrl?: string | null
  isAvailable: boolean
  isNew: boolean
}

export default function ProductCard({ product }: { product: ProductType }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="relative group bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full hover:border-orange-300">
        
        {/* RUBAN NEW */}

        {/* 1. RUBAN "NEW" (Visuel uniquement) */}
      {product.isNew && (
        <div className="absolute top-0 left-0 z-10">
          <div className="bg-red-500 text-white text-[10px] font-black px-8 py-1.5 -rotate-45 -translate-x-8 translate-y-3 shadow-md uppercase tracking-tighter">
            New
          </div>
        </div>
      )}

        {/* IMAGE SECTION */}
        <div className={`relative h-56 w-full flex items-center justify-center p-4 transition-all duration-300 ${!product.isAvailable ? 'bg-gray-100' : 'bg-gradient-to-br from-orange-50 to-orange-100/50'}`}>
          <img 
            src={product.imageUrl || "/burger-placeholder.png"} 
            alt={product.name} 
            className={`object-contain h-full w-full transition-transform duration-500 ${!product.isAvailable ? 'grayscale opacity-40' : 'group-hover:scale-105'}`} 
          />
          
          {!product.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-4 border-red-500 text-red-500 font-black px-4 py-2 rounded-lg bg-white/95 scale-110 shadow-xl">
                SOLD OUT
              </div>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-base text-gray-800 capitalize line-clamp-2">{product.name.toLowerCase()}</h3>
          
          <p className="mt-2 text-lg font-black text-orange-600">
            {product.price} <span className="text-xs text-gray-500">FCFA</span>
          </p>
          
          <p className="mt-2 text-gray-400 text-xs line-clamp-2 flex-grow">
            {product.description || "Qualité Mimo Fast Food"}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="p-4 pt-0 space-y-2">
          {product.isAvailable && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 text-sm"
            >
              Voir plus et commander
            </button>
          )}
          {!product.isAvailable && (
            <div className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-lg text-center font-semibold text-sm">
              Indisponible
            </div>
          )}
        </div>
      </div>

      <ProductDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={product}
      />
    </>
  )
}
"use client"

import { useState } from "react"
import { SpecialPlateModal } from "./SpecialPlateModal"

type SpecialPlate = {
  id: string
  day: string
  dishName: string
  imageUrl: string | null
  priceSmall: number
  priceLarge: number
}

export default function SpecialPlateClientSection({ special, today }: { special: SpecialPlate; today: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section className="max-w-4xl mx-auto -mt-16 relative z-20 px-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-1 shadow-2xl">
          <div className="bg-white rounded-[calc(1.5rem-1px)] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            {special.imageUrl && (
              <img 
                src={special.imageUrl} 
                alt={special.dishName}
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl shadow-md flex-shrink-0"
              />
            )}
            <div className="flex-grow">
              <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Plat du jour
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mt-3">{special.dishName}</h3>
              <p className="text-gray-600 mt-2 text-sm md:text-base">Disponible aujourd&apos;hui uniquement !</p>
              <div className="mt-4 flex gap-3 items-center">
                <span className="text-2xl md:text-3xl font-black text-orange-600">{special.priceSmall}</span>
                <span className="text-gray-300">|</span>
                <span className="text-2xl md:text-3xl font-black text-orange-600">{special.priceLarge}</span>
                <span className="text-xs text-gray-500">FCFA</span>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="whitespace-nowrap bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
            >
              Commander
            </button>
          </div>
        </div>
      </section>

      <SpecialPlateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        special={special}
      />
    </>
  )
}

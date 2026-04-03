"use client"

import { useState } from "react"
import { Modal } from "./Modal"
import { Toast, useToast } from "./Toast"

type SpecialPlate = {
  id: string
  day: string
  dishName: string
  imageUrl: string | null
  priceSmall: number
  priceLarge: number
}

type SpecialPlateModalProps = {
  isOpen: boolean
  onClose: () => void
  special: SpecialPlate | null
}

export function SpecialPlateModal({ isOpen, onClose, special }: SpecialPlateModalProps) {
  const [size, setSize] = useState<'small' | 'large'>('small')
  const { show: showToast, toasts } = useToast()

  if (!special) return null

  const price = size === 'small' ? special.priceSmall : special.priceLarge
  const label = size === 'small' ? 'Petit' : 'Grand'

  const addToCart = () => {
    const current = (JSON.parse(window.localStorage.getItem("mimo-cart") || "[]") as Array<{ productId: string; name: string; price: number; quantity: number }>)
    
    const productId = `special-${special.id}-${size}`
    const existing = current.find((item) => item.productId === productId)

    let newCart
    if (existing) {
      newCart = current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
    } else {
      newCart = [...current, { productId, name: `${special.dishName} (${label})`, price, quantity: 1 }]
    }

    window.localStorage.setItem("mimo-cart", JSON.stringify(newCart))
    window.dispatchEvent(new CustomEvent('mimo-cart-updated', { detail: { items: newCart } }))

    showToast(`${special.dishName} (${label}) ajouté au panier`, 'success')
    onClose()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Plat du jour : ${special.dishName}`}>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-8 text-center">
            {special.imageUrl ? (
              <img 
                src={special.imageUrl} 
                alt={special.dishName}
                className="w-full h-64 object-cover rounded-2xl mb-4 shadow-md"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-2xl mb-4 flex items-center justify-center text-gray-400">
                <span>Aucune image</span>
              </div>
            )}
            <h3 className="text-2xl font-black text-gray-800 mb-2">{special.dishName}</h3>
            <p className="text-gray-600">Disponible aujourd&apos;hui uniquement</p>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-gray-700">Choisir la taille :</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSize('small')}
                className={`p-4 border-2 rounded-xl transition ${
                  size === 'small'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <p className="font-bold">Petit</p>
                <p className="text-lg font-black text-orange-600">{special.priceSmall} FCFA</p>
              </button>

              <button
                onClick={() => setSize('large')}
                className={`p-4 border-2 rounded-xl transition ${
                  size === 'large'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <p className="font-bold">Grand</p>
                <p className="text-lg font-black text-orange-600">{special.priceLarge} FCFA</p>
              </button>
            </div>
          </div>

          <button
            onClick={addToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 text-lg"
          >
            Ajouter au panier ({label})
          </button>
        </div>
      </Modal>

      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} duration={toast.duration} />
      ))}
    </>
  )
}

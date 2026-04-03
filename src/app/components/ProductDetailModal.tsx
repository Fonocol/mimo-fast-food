"use client"

import { useState } from "react"
import { Modal } from "./Modal"
import { Toast, useToast } from "./Toast"

type Product = {
  id: string
  name: string
  price: number
  description?: string | null
  imageUrl?: string | null
  isAvailable: boolean
  isNew: boolean
}

type ProductDetailModalProps = {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { show: showToast, toasts } = useToast()

  if (!product) return null

  const addToCart = () => {
    const current = (JSON.parse(window.localStorage.getItem("mimo-cart") || "[]") as Array<{ productId: string; name: string; price: number; quantity: number }>)
    const existing = current.find((item) => item.productId === product.id)

    let newCart
    if (existing) {
      newCart = current.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item)
    } else {
      newCart = [...current, { productId: product.id, name: product.name, price: product.price, quantity }]
    }

    window.localStorage.setItem("mimo-cart", JSON.stringify(newCart))
    window.dispatchEvent(new CustomEvent('mimo-cart-updated', { detail: { items: newCart } }))

    showToast(`${quantity} × ${product.name} ajouté au panier`, 'success')
    setQuantity(1)
    onClose()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Image */}
          <div className="flex items-center justify-center bg-orange-50 rounded-2xl p-4 h-64 md:h-80">
            <img
              src={product.imageUrl || "/burger-placeholder.png"}
              alt={product.name}
              className="h-full object-contain"
            />
          </div>

          {/* Détails */}
          <div className="flex flex-col justify-between">
            {product.isNew && (
              <span className="inline-block w-fit bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold mb-2">
                NOUVEAU
              </span>
            )}

            <div>
              <p className="text-sm text-gray-500 mb-4">
                {product.description || "Recette authentique Mimo Fast Food, préparée avec des produits frais et de qualité."}
              </p>
              <p className="text-3xl font-black text-orange-600 mb-6">
                {product.price} <small className="text-lg">FCFA</small>
              </p>
            </div>

            {!product.isAvailable ? (
              <div className="w-full bg-gray-100 text-gray-500 py-3 rounded-xl text-center font-bold">
                Indisponible
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-white rounded transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-white rounded transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={addToCart}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"
                >
                  Ajouter {quantity} au panier
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} duration={toast.duration} />
      ))}
    </>
  )
}

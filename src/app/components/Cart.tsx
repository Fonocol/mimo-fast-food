"use client"

import { useEffect, useState } from "react"

type CartItem = { productId: string; name: string; price: number; quantity: number }

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize cart from localStorage after hydration
  useEffect(() => {
    const raw = window.localStorage.getItem("mimo-cart")
    try {
      const cartItems = raw ? JSON.parse(raw) : []
      setItems(cartItems)
    } catch {
      setItems([])
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    window.localStorage.setItem("mimo-cart", JSON.stringify(items))
  }, [items])

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail
      if (detail?.items) {
        setItems(detail.items)
      }
    }

    window.addEventListener('mimo-cart-updated', handleUpdate)
    return () => window.removeEventListener('mimo-cart-updated', handleUpdate)
  }, [])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const updateQty = (productId: string, quantity: number) => {
    setItems((prev) => prev
      .map((item) => item.productId === productId ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0)
    )
  }

  const clearCart = () => {
    setItems([])
    setPhone("")
    setAddress("")
  }

  const sendOrder = async () => {
    if (!phone) {
      setMessage("Veuillez renseigner un numéro de téléphone.")
      return
    }
    if (items.length === 0) {
      setMessage("Panier vide.")
      return
    }

    setIsLoading(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerPhone: phone,
        deliveryAddress: address,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      })
    })

    const data = await res.json()
    setIsLoading(false)
    if (data.success) {
      clearCart()
      setMessage('Commande envoyée avec succès!')
      setTimeout(() => setMessage(""), 3000)
    } else {
      setMessage((data.error || 'Impossible de passer la commande.'))
    }
  }

  if (!isHydrated || items.length === 0) {
    return null
  }

  return (
    <div className="relative md:sticky md:top-20 z-40 bg-white rounded-2xl border border-gray-200 shadow-xl p-3 sm:p-4 md:p-6 mb-4 md:mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-black text-orange-600">Panier</h2>
        <span className="bg-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
          {items.length}
        </span>
      </div>

      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between items-center bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100 text-sm sm:text-base shadow-sm">
            <div className="flex-grow min-w-0 pr-3">
              <p className="font-semibold text-gray-800 truncate mb-1">{item.name}</p>
              <p className="text-xs text-gray-500 font-medium">{item.price} FCFA</p>
            </div>
            <div className="flex gap-1 items-center bg-white rounded-lg border border-gray-200 flex-shrink-0 shadow-sm">
              <button 
                onClick={() => updateQty(item.productId, item.quantity - 1)} 
                className="px-3 py-2 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors text-sm font-semibold"
              >
                −
              </button>
              <span className="px-3 py-2 font-bold text-gray-800 min-w-[2rem] text-center bg-gray-50">
                {item.quantity}
              </span>
              <button 
                onClick={() => updateQty(item.productId, item.quantity + 1)} 
                className="px-3 py-2 hover:bg-green-50 text-gray-600 hover:text-green-600 transition-colors text-sm font-semibold"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-gray-100 pt-3 mb-4">
        <p className="text-right font-black text-base sm:text-lg text-orange-600">Total: {total} FCFA</p>
      </div>

      <div className="space-y-2 mb-4">
        <input 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          placeholder="Téléphone (ex: +237656575976)" 
          className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
        />
        <input 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          placeholder="Adresse de livraison (optionnel)" 
          className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
        />
      </div>

      <button 
        onClick={sendOrder} 
        disabled={isLoading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-2.5 rounded-lg font-bold transition-all active:scale-95 text-sm sm:text-base"
      >
        {isLoading ? "Envoi..." : "Valider commande"}
      </button>

      {message && (
        <p className={`mt-3 text-sm text-center font-semibold ${message.includes('succès') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}

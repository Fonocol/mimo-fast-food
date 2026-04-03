// src/app/register/page.tsx
'use client'

import { registerUser } from "@/app/actions/register"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const res = await registerUser(formData)
    if (res.error) setError(res.error)
    else router.push("/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <form action={handleSubmit} className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-orange-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-orange-600 mb-2">MIMO</h1>
          <p className="text-sm sm:text-base text-gray-600">Creer un compte</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-200 font-semibold">
            {error}
          </div>
        )}
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
            <input name="name" type="text" placeholder="Votre nom" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input name="email" type="email" placeholder="votre@email.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
            <input name="password" type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm" required />
          </div>
        </div>
        
        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg mt-6 text-sm sm:text-base">
          S&apos;inscrire
        </button>
      </form>
    </div>
  )
}
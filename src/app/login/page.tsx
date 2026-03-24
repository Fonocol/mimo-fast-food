// src/app/login/page.tsx
'use client'

import { authenticate } from "@/app/actions/login"
import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [error, setError] = useState("")

  async function handleSubmit(formData: FormData) {
    const res = await authenticate(formData)
    if (res?.error) setError(res.error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Bon retour ! 👋</h1>
        <p className="text-gray-500 mb-6">Connectez-vous pour commander plus vite.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full bg-orange-500 text-white p-3 rounded-xl font-bold hover:bg-orange-600 transform active:scale-95 transition-all">
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-orange-600 font-bold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
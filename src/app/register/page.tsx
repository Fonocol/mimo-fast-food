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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form action={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-orange-600">Créer un compte Mimo</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <input name="name" type="text" placeholder="Nom complet" className="w-full p-3 border rounded-lg mb-4" />
        <input name="email" type="email" placeholder="Email" className="w-full p-3 border rounded-lg mb-4" required />
        <input name="password" type="password" placeholder="Mot de passe" className="w-full p-3 border rounded-lg mb-6" required />
        
        <button type="submit" className="w-full bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600">
          S'inscrire
        </button>
      </form>
    </div>
  )
}
// src/app/actions/register.ts
'use server'

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  if (!email || !password) return { error: "Champs requis" }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'USER' // Client par défaut
      }
    })
    return { success: "Compte créé ! Connectez-vous." }
  } catch (e) {
    return { error: "Cet email est déjà utilisé." }
  }
}
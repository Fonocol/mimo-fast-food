// src/app/actions/login.ts
'use server'

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(formData: FormData) {
  try {
    await signIn("credentials", Object.fromEntries(formData))
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Identifiants invalides." }
        default:
          return { error: "Une erreur est survenue." }
      }
    }
    throw error // Important pour la redirection de NextAuth
  }
}
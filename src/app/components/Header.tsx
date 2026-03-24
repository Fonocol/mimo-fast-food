// src/components/Header.tsx
import Link from "next/link";
import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-orange-600 italic">
          MIMO<span className="text-gray-800 font-bold">FAST</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-medium">
          <Link href="/menu" className="hover:text-orange-600 transition">Menu</Link>
          <Link href="/special" className="hover:text-orange-600 transition">Plats du jour</Link>
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <Link href="/profile" className="text-sm font-semibold bg-gray-100 px-4 py-2 rounded-full">
              Mon Compte
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-bold text-orange-600 border border-orange-600 px-4 py-2 rounded-full hover:bg-orange-50 transition">
              Connexion
            </Link>
          )}
          {/* Le bouton Panier pourra être ajouté ici en composant client plus tard */}
        </div>
      </div>
    </header>
  );
}
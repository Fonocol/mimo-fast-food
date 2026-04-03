// src/components/Header.tsx
"use client"

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-black text-orange-600 italic">
          MIMO<span className="text-gray-800 font-bold">FAST</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-medium">
          <Link href="/" className="hover:text-orange-600 transition">Menu</Link>
          <Link href="/special" className="hover:text-orange-600 transition">Plats du jour</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
            <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
          </div>
        </button>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              {session.user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-sm font-semibold bg-orange-100 text-orange-700 px-4 py-2 rounded-full">
                  Admin
                </Link>
              )}
              <Link href="/profile" className="text-sm font-semibold bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition">
                Mes Commandes
              </Link>
              <form action="/api/auth/signout" method="post" className="inline">
                <button type="submit" className="text-sm font-semibold text-red-500 border border-red-300 px-4 py-2 rounded-full hover:bg-red-50">Déconnexion</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-sm font-bold text-orange-600 border border-orange-600 px-4 py-2 rounded-full hover:bg-orange-50 transition">
              Connexion
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 px-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/special"
              className="block py-2 px-3 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Plats du jour
            </Link>
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
              {session ? (
                <>
                  {session.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="block py-2 px-3 rounded-lg bg-orange-100 text-orange-700 font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="block py-2 px-3 rounded-lg hover:bg-gray-100 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes Commandes
                  </Link>
                  <form action="/api/auth/signout" method="post">
                    <button
                      type="submit"
                      className="w-full text-left py-2 px-3 rounded-lg text-red-500 hover:bg-red-50 transition"
                    >
                      Déconnexion
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block py-2 px-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
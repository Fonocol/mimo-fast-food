// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Branding */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-black text-orange-600 italic mb-4">MIMO FAST FOOD</h3>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              Le goût qui fait la différence à Douala. Spécialiste du burger artisanal et des plats chauds traditionnels.
            </p>
          </div>

          {/* Contact Rapide */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Nous trouver</h4>
            <ul className="text-gray-500 text-sm space-y-3">
              <li className="flex items-center gap-2">📍 Douala, Cameroun</li>
              <li className="flex items-center gap-2">📞 +237 656 57 59 76</li>
              <li className="flex items-center gap-2">📞 +237 695 99 16 34</li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Horaires d'ouverture</h4>
            <ul className="text-gray-500 text-sm space-y-2">
              <li className="flex justify-between"><span>Lun - Sam</span> <span>08h - 22h</span></li>
              <li className="flex justify-between text-orange-600 font-medium"><span>Dimanche</span> <span>08h - 22h</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            © 2026 Mimo Fast Food. Made with ❤️ in Cameroon.
          </p>
          <div className="flex gap-6 text-xs font-medium text-gray-400">
            <Link href="/terms" className="hover:text-orange-600">Conditions</Link>
            <Link href="/privacy" className="hover:text-orange-600">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
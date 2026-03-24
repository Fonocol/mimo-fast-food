import prisma from '@/lib/prisma'

export default async function SpecialPage() {
  const specials = await prisma.specialPlate.findMany()
  const days = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"]

  return (
    <div className="max-w-4xl mx-auto p-6 py-12">
      <h1 className="text-4xl font-black text-center mb-12 uppercase italic text-orange-600">
        Le Calendrier des Plats Chauds
      </h1>
      
      <div className="space-y-4">
        {days.map((day) => {
          const dish = specials.find(s => s.day === day)
          return (
            <div key={day} className="flex items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-200 transition">
              <div className="w-32 font-black text-gray-300 text-xl">{day}</div>
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-gray-800">{dish?.dishName || "À venir..."}</h3>
                <p className="text-orange-500 font-bold">{dish?.priceSmall} - {dish?.priceLarge} FCFA</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
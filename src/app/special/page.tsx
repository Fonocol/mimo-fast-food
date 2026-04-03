import prisma from '@/lib/prisma'

export default async function SpecialPage() {
  const specials = await prisma.specialPlate.findMany()
  const days = ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-orange-600 mb-3 md:mb-4">
            Plats du Jour
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Découvrez notre sélection quotidienne de plats chauds, préparés avec soin pour votre plaisir
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {days.map((day) => {
            const dish = specials.find(s => s.day === day)
            const isToday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(new Date()).toUpperCase() === day

            return (
              <div
                key={day}
                className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl overflow-hidden ${
                  isToday
                    ? 'border-orange-500 ring-2 ring-orange-200'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                {/* Today Badge */}
                {isToday && (
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-orange-500 text-white px-2 py-1 sm:px-3 rounded-full text-xs font-bold">
                    AUJOURD'HUI
                  </div>
                )}

                {/* Image Section */}
                <div className="relative h-36 sm:h-40 md:h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  {dish?.imageUrl ? (
                    <img
                      src={dish.imageUrl}
                      alt={dish.dishName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400 px-4">
                      <div className="text-2xl sm:text-4xl mb-2 font-bold text-gray-300">PLAT</div>
                      <p className="text-xs sm:text-sm">Image à venir</p>
                    </div>
                  )}

                  {/* Overlay for unavailable */}
                  {!dish && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="bg-white/90 text-gray-600 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                        À venir
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  {/* Day */}
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h2 className={`text-lg sm:text-xl font-black ${isToday ? 'text-orange-600' : 'text-gray-800'}`}>
                      {day}
                    </h2>
                    {isToday && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                        Disponible
                      </span>
                    )}
                  </div>

                  {/* Dish Name */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 min-h-[2.5rem] sm:min-h-[3rem] flex items-center leading-tight">
                    {dish?.dishName || "Plat à définir"}
                  </h3>

                  {/* Prices */}
                  {dish ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                        <span className="text-xs sm:text-sm font-semibold text-gray-600">Petit</span>
                        <span className="text-base sm:text-lg font-black text-orange-600">{dish.priceSmall} FCFA</span>
                      </div>
                      <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                        <span className="text-xs sm:text-sm font-semibold text-gray-600">Grand</span>
                        <span className="text-base sm:text-lg font-black text-orange-600">{dish.priceLarge} FCFA</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 sm:p-4 bg-gray-100 rounded-lg sm:rounded-xl text-center">
                      <p className="text-gray-500 text-xs sm:text-sm">Plat en préparation</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-8 md:mt-12 text-center">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Commande anticipée</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Réservez votre plat du jour dès maintenant pour éviter les ruptures de stock.
              Disponible uniquement le jour indiqué.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
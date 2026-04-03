import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

async function createSpecialPlate(formData: FormData) {
  'use server'
  const day = (formData.get('day') as string)?.trim().toUpperCase()
  const dishName = formData.get('dishName') as string
  const imageUrl = formData.get('imageUrl') as string
  const priceSmall = Number(formData.get('priceSmall'))
  const priceLarge = Number(formData.get('priceLarge'))

  if (!day || !dishName || !priceSmall || !priceLarge) return

  await prisma.specialPlate.upsert({
    where: { day },
    update: { dishName, imageUrl, priceSmall, priceLarge },
    create: { day, dishName, imageUrl, priceSmall, priceLarge }
  })
}

async function deleteSpecialPlate(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await prisma.specialPlate.delete({ where: { id } })
}

export default async function SpecialPlatesPage() {
  const session = await auth()
  const userRole = (session?.user as { role?: string } | null)?.role
  if (!session || userRole !== 'ADMIN') redirect('/')

  const specials = await prisma.specialPlate.findMany({ orderBy: { day: 'asc' } })
  const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE']

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-black text-orange-600 mb-8">Gérer les Plats du Jour</h1>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ajouter/Modifier un plat</h2>
        <form action={createSpecialPlate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Jour de la semaine</label>
            <select name="day" className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required>
              <option value="">Choisir un jour</option>
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du plat</label>
            <input name="dishName" type="text" placeholder="Ex: Burger Mimo" className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Petit (FCFA)</label>
            <input name="priceSmall" type="number" placeholder="1000" className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Grand (FCFA)</label>
            <input name="priceLarge" type="number" placeholder="1500" className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
            <input name="imageUrl" type="text" placeholder="https://..." className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>

          <button type="submit" className="md:col-span-2 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-bold transition-all">
            Enregistrer le plat
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Plats actuels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map((day) => {
            const special = specials.find((s) => s.day === day)
            return (
              <div key={day} className={`border rounded-lg p-4 ${special ? 'border-orange-300 bg-orange-50' : 'border-gray-200'}`}>
                <p className="font-semibold text-gray-600">{day}</p>
                {special ? (
                  <div className="mt-2">
                    <p className="font-bold text-lg text-gray-800">{special.dishName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      De {special.priceSmall} a {special.priceLarge} FCFA
                    </p>
                    {special.imageUrl && (
                      <img src={special.imageUrl} alt={special.dishName} className="w-full h-24 object-cover rounded mt-2" />
                    )}
                    <form action={deleteSpecialPlate} className="mt-3">
                      <input type="hidden" name="id" value={special.id} />
                      <button type="submit" className="text-red-600 hover:text-red-700 font-semibold text-sm">
                        Supprimer
                      </button>
                    </form>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-2">Aucun plat configure</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

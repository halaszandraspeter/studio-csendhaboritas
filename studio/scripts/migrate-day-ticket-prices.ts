import { getCliClient } from 'sanity/cli'

// One-time migration: `days` used to be a flat array of date strings.
// Converts each entry into { date, ticketPrice }, defaulting ticketPrice to
// the previously-hardcoded 2000 Ft so the frontend keeps rendering the same
// price until an editor updates it in the Studio.
const client = getCliClient()

function randomKey() {
  return Math.random().toString(36).slice(2, 10)
}

async function run() {
  const active: { _id: string; days?: unknown[] } | null = await client.fetch(
    `*[_type == "event" && isActive == true][0]{ _id, days }`
  )
  if (!active) throw new Error('Nincs aktív esemény.')

  const days = active.days ?? []
  const alreadyMigrated = days.some((d) => typeof d === 'object' && d !== null)
  if (alreadyMigrated) {
    console.log('A days mező már objektum formátumú, nincs teendő.')
    return
  }

  const migratedDays = (days as string[]).map((date) => ({
    _key: randomKey(),
    _type: 'eventDay',
    date,
    ticketPrice: 2000,
  }))

  await client.patch(active._id).set({ days: migratedDays }).commit()

  console.log(`Frissítve: ${active._id}`, migratedDays)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

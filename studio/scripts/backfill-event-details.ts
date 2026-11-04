import { getCliClient } from 'sanity/cli'

// One-time backfill: populate the active event's new date/year/city/hero fields
// so the frontend keeps rendering the same content once it reads them from CMS.
const client = getCliClient()

const HERO_DESCRIPTION = [
  'Egy fesztivál a miskolci undergroundért.',
  '12 előadó, 2 nap és 1 közös cél:',
  '',
  'egy olyan közeg megteremtése,',
  'ahol az új hangok egymásra találnak.',
].join('\n')

async function run() {
  const active: { _id: string } | null = await client.fetch(
    `*[_type == "event" && isActive == true][0]{ _id }`
  )
  if (!active) throw new Error('Nincs aktív esemény.')

  await client
    .patch(active._id)
    .setIfMissing({
      days: ['2026-10-09', '2026-10-10'],
      year: '2026',
      city: 'Miskolc',
      heroDescription: HERO_DESCRIPTION,
    })
    .commit()

  console.log(`Frissítve: ${active._id}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

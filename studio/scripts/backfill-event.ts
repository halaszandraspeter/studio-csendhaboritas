import { getCliClient } from 'sanity/cli'

// One-time backfill: attach every band/activity without an event to the active event.
const client = getCliClient()

async function run() {
  const activeId: string | null = await client.fetch(
    `*[_type == "event" && isActive == true][0]._id`
  )
  if (!activeId) throw new Error('Nincs aktív esemény — jelölj ki egyet előbb.')

  const docs: { _id: string }[] = await client.fetch(
    `*[_type in ["band", "activity"] && !defined(event)]{ _id }`
  )
  if (docs.length === 0) {
    console.log('Nincs frissítendő dokumentum.')
    return
  }

  let tx = client.transaction()
  for (const d of docs) {
    tx = tx.patch(d._id, (p) => p.set({ event: { _type: 'reference', _ref: activeId } }))
  }
  await tx.commit()
  console.log(`Frissítve ${docs.length} dokumentum -> ${activeId}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

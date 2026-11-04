import { defineField } from 'sanity'
import { createClient } from '@sanity/client'

// Read-only client (production dataset is public) used to default new docs to the active event.
const readClient = createClient({
  projectId: 'ce4wb46n',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

async function activeEventRef() {
  const id = await readClient.fetch(`*[_type == "event" && isActive == true][0]._id`)
  return id ? { _type: 'reference' as const, _ref: id } : undefined
}

// Reference tying a band/activity to a single event. New docs auto-attach to the active event.
export const eventReferenceField = defineField({
  name: 'event',
  title: 'Esemény',
  type: 'reference',
  to: [{ type: 'event' }],
  description: 'Melyik eseményhez tartozik. Új elem automatikusan az aktív eseményhez kerül.',
  validation: (Rule) => Rule.required(),
  initialValue: activeEventRef,
})

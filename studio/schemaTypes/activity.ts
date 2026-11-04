import { defineField, defineType } from 'sanity'
import { defineImageField } from 'sanity-plugin-image-field'
import { eventReferenceField } from './eventScope'

export const activitySchema = defineType({
  name: 'activity',
  title: 'Program / Aktivitás',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Program neve',
      type: 'string',
      description: 'pl. "Kapunyitás", "Sörpong", "Sörivó verseny"',
      validation: (Rule) => Rule.required(),
    }),
    eventReferenceField,
    defineField({
      name: 'day',
      title: 'Nap',
      type: 'number',
      description: '1 = Október 9., 2 = Október 10.',
      options: {
        list: [
          { title: 'Október 9.', value: 1 },
          { title: 'Október 10.', value: 2 },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().integer().min(1).max(2),
    }),
    defineField({
      name: 'setTime',
      title: 'Időpont',
      type: 'string',
      description: 'pl. "22:30"',
    }),
    defineField({
      name: 'hajnal',
      title: 'Hajnali időpont',
      type: 'boolean',
      description:
        'Ha be van kapcsolva, az időpont (pl. "02:00") éjfél utáni, hajnali időpontnak számít, és a program az adott nap műsorának végén jelenik meg — annak ellenére, hogy az óra kora reggelinek tűnik.',
      initialValue: false,
    }),
    defineImageField({
      name: 'image',
      title: 'Kép (1:1, opcionális)',
      description: 'Négyzet alakú kép. A kivágó eszköz automatikusan 1:1 arányra van zárva.',
      aspectRatio: 1,
      requiredDimensions: { width: 400, height: 400 },
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Leírás',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'day', media: 'image' },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle === 1 ? 'Október 9.' : 'Október 10.',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Nap, majd időpont',
      name: 'dayAndTime',
      by: [
        { field: 'day', direction: 'asc' },
        { field: 'setTime', direction: 'asc' },
      ],
    },
  ],
})

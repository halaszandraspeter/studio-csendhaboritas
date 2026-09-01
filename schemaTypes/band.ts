import { defineField, defineType } from 'sanity'

export const bandSchema = defineType({
  name: 'band',
  title: 'Zenekar',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Zenekar neve',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
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
      title: 'Fellépési idő',
      type: 'string',
      description: 'pl. "22:30"',
    }),
    defineField({
      name: 'genre',
      title: 'Műfaj',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bemutatkozás',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'bandLogoImage',
      title: 'Zenekar logó (redesigned, event-color underlay)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bandPhotoImage',
      title: 'Zenekar fotó (pre-cut transparent PNG)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cardThumbnailImage',
      title: 'Kártya kép (négyszögletes crop, grid-hez)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'members',
      title: 'Tagok (opcionális)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Név', type: 'string' }),
            defineField({
              name: 'photo',
              title: 'Fotó',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'nameAlignment',
              title: 'Név igazítás',
              type: 'string',
              options: {
                list: [
                  { title: 'Balra', value: 'left' },
                  { title: 'Jobbra', value: 'right' },
                ],
                layout: 'radio',
              },
              initialValue: 'left',
            }),
          ],
          preview: {
            select: { title: 'name', media: 'photo' },
          },
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social / streaming linkek',
      type: 'object',
      fields: [
        defineField({ name: 'spotify', title: 'Spotify', type: 'url' }),
        defineField({ name: 'soundcloud', title: 'SoundCloud', type: 'url' }),
        defineField({ name: 'appleMusic', title: 'Apple Music', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube', type: 'url' }),
      ],
    }),
    defineField({
      name: 'musicEmbedUrl',
      title: 'Zene embed URL (Spotify / SoundCloud iframe src)',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'day', media: 'cardThumbnailImage' },
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
      title: 'Nap, majd fellépési idő',
      name: 'dayAndTime',
      by: [
        { field: 'day', direction: 'asc' },
        { field: 'setTime', direction: 'asc' },
      ],
    },
  ],
})

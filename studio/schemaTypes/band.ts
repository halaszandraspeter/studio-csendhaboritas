import { defineField, defineType } from 'sanity'
import { defineImageField } from 'sanity-plugin-image-field'
import { createImageUrlBuilder } from '@sanity/image-url'
import { createElement } from 'react'
import { eventReferenceField } from './eventScope'

const imageBuilder = createImageUrlBuilder({ projectId: 'ce4wb46n', dataset: 'production' })

// Renders the logo letterboxed on a solid black square so it never gets cropped.
function blackBgLogo(image: unknown) {
  const url = imageBuilder
    .image(image as Parameters<typeof imageBuilder.image>[0])
    .ignoreImageParams()
    .width(200)
    .height(200)
    .fit('fill')
    .bg('000000')
    .format('jpg')
    .url()
  return createElement('img', {
    src: url,
    alt: '',
    style: { width: '100%', height: '100%', objectFit: 'contain', background: '#000', display: 'block' },
  })
}

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
    eventReferenceField,
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        // Unique only within the same event, so a returning band can reuse its slug next year.
        isUnique: async (slug, context) => {
          const { document, getClient } = context
          const client = getClient({ apiVersion: '2024-01-01' })
          const id = (document?._id ?? '').replace(/^drafts\./, '')
          const eventRef = (document as { event?: { _ref?: string } })?.event?._ref ?? null
          const count = await client.fetch(
            `count(*[_type == "band" && !(_id in [$draft, $published]) && slug.current == $slug && event._ref == $eventRef])`,
            { draft: `drafts.${id}`, published: id, slug, eventRef }
          )
          return count === 0
        },
      },
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
      name: 'hajnal',
      title: 'Hajnali időpont',
      type: 'boolean',
      description:
        'Ha be van kapcsolva, a fellépési idő (pl. "02:00") éjfél utáni, hajnali időpontnak számít, és a fellépés az adott nap műsorának végén jelenik meg — annak ellenére, hogy az óra kora reggelinek tűnik.',
      initialValue: false,
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
      name: 'logoShadowEffect',
      title: 'Logó árnyék effekt',
      type: 'boolean',
      description:
        'Ha be van kapcsolva, a logó (vagy a zenekar neve) fehér színnel és a nap színével eltolt árnyékkal jelenik meg. Kapcsold ki többszínű logónál.',
      initialValue: true,
    }),
    defineImageField({
      name: 'bandPhotoImage',
      title: 'Zenekar fotó (4:5, függőleges)',
      description: 'A zenekar oldalon függőlegesen jelenik meg. A kivágó eszköz automatikusan 4:5 arányra van zárva.',
      aspectRatio: 4 / 5,
      requiredDimensions: { width: 800, height: 1000 },
      options: { hotspot: true },
    }),
    defineImageField({
      name: 'cardThumbnailImage',
      title: 'Kártya kép (3:2, vízszintes)',
      description: 'A főoldali zenekar rácsban jelenik meg. A kivágó eszköz automatikusan 3:2 arányra van zárva.',
      aspectRatio: 3 / 2,
      requiredDimensions: { width: 900, height: 600 },
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
            defineImageField({
              name: 'photo',
              title: 'Fotó (1:1)',
              description: 'Négyzet alakú kép. A kivágó eszköz automatikusan 1:1 arányra van zárva.',
              aspectRatio: 1,
              requiredDimensions: { width: 400, height: 400 },
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
    defineField({
      name: 'gallery',
      title: 'Galéria – koncertfotók',
      type: 'array',
      description:
        'A zenekar fellépéséről készült fotók. Az archívum oldalon a zenekar szerint szűrhetők.',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' },
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'day', media: 'bandLogoImage' },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle === 1 ? 'Október 9.' : 'Október 10.',
        media: media ? blackBgLogo(media) : undefined,
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

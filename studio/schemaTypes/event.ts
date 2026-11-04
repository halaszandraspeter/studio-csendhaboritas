import { defineField, defineType } from 'sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import { createElement } from 'react'

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

export const eventSchema = defineType({
  name: 'event',
  title: 'Esemény',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Esemény neve',
      type: 'string',
      initialValue: 'Miskolci Csendháborítás',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Aktív esemény',
      type: 'boolean',
      description: 'Jelöld be az aktuálisan aktív eseményt. Csak egy esemény lehet aktív egyszerre!',
      initialValue: false,
    }),
    defineField({
      name: 'days',
      title: 'Napok (dátum + napijegy ár)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'eventDay',
          fields: [
            defineField({
              name: 'date',
              title: 'Dátum',
              type: 'date',
              options: { dateFormat: 'YYYY. MMMM D.' },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'ticketPrice',
              title: 'Napijegy ára (Ft)',
              type: 'number',
              description: 'Az adott napra szóló napijegy ára forintban (pl. a főoldali matricán).',
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: 'soldOut',
              title: 'SOLD OUT',
              type: 'boolean',
              description: 'When enabled, the homepage sticker shows "SOLD OUT" instead of the price.',
              initialValue: false,
            }),
          ],
          preview: {
            select: { date: 'date', price: 'ticketPrice', soldOut: 'soldOut' },
            prepare({ date, price, soldOut }) {
              return {
                title: date ?? 'Nincs dátum',
                subtitle: soldOut ? 'SOLD OUT' : price != null ? `${price} Ft` : 'Nincs ár megadva',
              }
            },
          },
        },
      ],
      description:
        'Az esemény napjai, dátummal és napijeggyel. A sorrend adja az 1. nap, 2. nap… sorszámot, és ebből generálódnak a dátumcímkék (pl. „Október 9.”) és a főoldali napijegy-matricák.',
    }),
    defineField({
      name: 'year',
      title: 'Évszám',
      type: 'string',
      initialValue: '2026',
      description: 'Szövegként jelenik meg (pl. láblécben, meta leírásban).',
    }),
    defineField({
      name: 'city',
      title: 'Város',
      type: 'string',
      initialValue: 'Miskolc',
      description: 'A helyszín városa (a hero és a láblécek „· Miskolc” részéhez).',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Főoldali leírás (hero)',
      type: 'text',
      rows: 5,
      description:
        'A főoldal hero szekciójában jelenik meg. Minden sor külön kiemelt sorként; üres sor térközt ad.',
    }),
    defineField({
      name: 'archiveMode',
      title: 'Archív mód',
      type: 'string',
      description:
        'Automatikus: az utolsó nap után 7 nappal az oldal archív módra vált (Koncertek helyett aftermovie, Házirend helyett Archívum). A másik két opcióval kézzel felülírható.',
      options: {
        list: [
          { title: 'Automatikus (dátum alapján)', value: 'auto' },
          { title: 'Mindig élő mód', value: 'live' },
          { title: 'Mindig archív mód', value: 'archive' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'aftermovieUrl',
      title: 'Aftermovie (YouTube link)',
      type: 'url',
      description:
        'Sima YouTube link (pl. https://www.youtube.com/watch?v=… vagy https://youtu.be/…). Archív módban a főoldalon jelenik meg. Ha üres, a videó rész rejtve marad.',
      validation: (Rule) =>
        Rule.custom((url?: string) => {
          if (!url) return true
          return /(?:youtube\.com|youtu\.be)\//.test(url) ? true : 'Csak YouTube link adható meg.'
        }),
    }),
    defineField({
      name: 'gallery',
      title: 'Galéria – hangulatfotók',
      type: 'array',
      description:
        'Általános fotók (közönség, helyszín), amelyek nem egy zenekarhoz tartoznak. A zenekarok fotóit a zenekar dokumentumánál töltsd fel.',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'ogImage',
      title: 'Megosztási kép (Open Graph)',
      type: 'image',
      description:
        'Facebook/Messenger/Twitter linkmegosztáskor megjelenő kép. Ajánlott méret: 1200×630px.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mainLogo',
      title: 'Fő logó (sötét háttérhez)',
      type: 'image',
      description: 'A fejlécben és a főoldal hero szekciójában használt logó.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'lightLogo',
      title: 'Világos logó (zenekar oldalhoz)',
      type: 'image',
      description: 'A zenekar részletező oldalon, fotó felett használt logóváltozat.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'venue',
      title: 'Helyszín neve',
      type: 'string',
      initialValue: 'Grizzly Music Pub',
    }),
    defineField({
      name: 'address',
      title: 'Cím',
      type: 'string',
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Google Maps embed',
      type: 'text',
      rows: 2,
      description:
        'Google Maps → Share → Embed a map. Paste either the full <iframe> code or just the URL from its src="…" attribute.',
    }),
    defineField({
      name: 'venueDescription',
      title: 'Helyszín leírása',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'venuePhotos',
      title: 'Helyszín fotók',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'transportInfo',
      title: 'Megközelítés / parkolás',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social linkek',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'tiktok', title: 'TikTok', type: 'url' }),
      ],
    }),
    defineField({
      name: 'sponsors',
      title: 'Szponzorok / partnerek',
      type: 'array',
      description: 'Jelölj ki pontosan egy fő támogatót, aki kiemelten jelenik meg.',
      validation: (Rule) =>
        Rule.custom((sponsors?: { isMain?: boolean }[]) => {
          const mainCount = (sponsors ?? []).filter((s) => s?.isMain).length
          return mainCount > 1 ? 'Csak egy fő támogató lehet.' : true
        }),
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Név', type: 'string' }),
            defineField({
              name: 'logo',
              title: 'Logó',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({ name: 'url', title: 'Weboldal', type: 'url' }),
            defineField({
              name: 'isMain',
              title: 'Fő támogató',
              type: 'boolean',
              description: 'Kiemelt fő támogató. Csak egy lehet!',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'name', media: 'logo', isMain: 'isMain' },
            prepare({ title, media, isMain }) {
              return {
                title: isMain ? `★ ${title ?? ''}`.trim() : title,
                subtitle: isMain ? 'Fő támogató' : undefined,
                media,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'organizers',
      title: 'Szervezők',
      type: 'array',
      description: 'Kapcsolattartók a rendezvényhez',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Név',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Szerepkör',
              type: 'string',
              description: 'Pl. "Főszervező", "Szervező" - megjelenik a "MI VAGYOK" stílusban',
            }),
            defineField({
              name: 'email',
              title: 'E-mail',
              type: 'string',
            }),
            defineField({
              name: 'mobile',
              title: 'Telefonszám',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'name', email: 'email' },
            prepare({ title, email }) {
              return {
                title: title || 'Új szervező',
                subtitle: email,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'rules',
      title: 'Házirend',
      type: 'array',
      description: 'A rendezvény házirendjének pontjai',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Cím',
              type: 'string',
              description: 'Rövid, figyelemfelkeltő cím (pl. "BELÉPÉS = BELEEGYEZÉS")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Leírás',
              type: 'text',
              rows: 3,
              description: 'Részletes magyarázat. Minden sor külön bekezdésként jelenik meg.',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Új szabály',
                subtitle: subtitle?.slice(0, 60) + (subtitle?.length > 60 ? '...' : ''),
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'venue', isActive: 'isActive', media: 'mainLogo' },
    prepare({ title, subtitle, isActive, media }) {
      return {
        title: isActive ? `✓ ${title}` : title,
        subtitle: isActive ? `${subtitle} (AKTÍV)` : subtitle,
        media: media ? blackBgLogo(media) : undefined,
      }
    },
  },
})

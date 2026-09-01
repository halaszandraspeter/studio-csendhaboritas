import { defineField, defineType } from 'sanity'

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
          ],
          preview: {
            select: { title: 'name', media: 'logo' },
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
    select: { title: 'name', subtitle: 'venue', isActive: 'isActive' },
    prepare({ title, subtitle, isActive }) {
      return {
        title: isActive ? `✓ ${title}` : title,
        subtitle: isActive ? `${subtitle} (AKTÍV)` : subtitle,
      }
    },
  },
})

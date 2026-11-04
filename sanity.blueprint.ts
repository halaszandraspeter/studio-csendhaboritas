import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'vercel-deploy',
      event: {
        on: ['create', 'update', 'delete'],
        filter: '_type in ["band", "event", "activity"]',
      },
    }),
  ],
})
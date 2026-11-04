import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {createExclusiveActivePublishAction} from './actions/exclusiveActivePublish'

export default defineConfig({
  name: 'default',
  title: 'CSENDHÁBORÍTÁS',

  projectId: 'ce4wb46n',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Tartalom')
          .items([
            S.listItem()
              .title('Események')
              .schemaType('event')
              .child(S.documentTypeList('event').title('Események')),
            S.divider(),
            S.listItem()
              .title('Zenekarok — aktív esemény')
              .schemaType('band')
              .child(async () => {
                const eventId = await context
                  .getClient({apiVersion: '2024-01-01'})
                  .fetch<string | null>('*[_type == "event" && isActive == true][0]._id')
                return S.documentList()
                  .title('Zenekarok — aktív esemény')
                  .schemaType('band')
                  // Reference equality (not a `->` join) so new matching documents
                  // show up live — see /docs/studio/structure-builder-reference:
                  // joined filters only evaluate per-document and miss "appear" events.
                  .filter('_type == "band" && event._ref == $eventId')
                  .params({eventId})
                  .defaultOrdering([
                    {field: 'day', direction: 'asc'},
                    {field: 'setTime', direction: 'asc'},
                  ])
              }),
            S.listItem()
              .title('Programok — aktív esemény')
              .schemaType('activity')
              .child(async () => {
                const eventId = await context
                  .getClient({apiVersion: '2024-01-01'})
                  .fetch<string | null>('*[_type == "event" && isActive == true][0]._id')
                return S.documentList()
                  .title('Programok — aktív esemény')
                  .schemaType('activity')
                  .filter('_type == "activity" && event._ref == $eventId')
                  .params({eventId})
                  .defaultOrdering([
                    {field: 'day', direction: 'asc'},
                    {field: 'setTime', direction: 'asc'},
                  ])
              }),
            S.divider(),
            S.listItem()
              .title('Archívum — események szerint')
              .child(
                S.documentTypeList('event')
                  .title('Válassz eseményt')
                  .child((eventId) =>
                    S.list()
                      .title('Esemény tartalma')
                      .items([
                        S.listItem()
                          .title('Zenekarok')
                          .child(
                            S.documentList()
                              .title('Zenekarok')
                              .schemaType('band')
                              .filter('_type == "band" && event._ref == $eventId')
                              .params({eventId})
                              .defaultOrdering([
                                {field: 'day', direction: 'asc'},
                                {field: 'setTime', direction: 'asc'},
                              ])
                          ),
                        S.listItem()
                          .title('Programok')
                          .child(
                            S.documentList()
                              .title('Programok')
                              .schemaType('activity')
                              .filter('_type == "activity" && event._ref == $eventId')
                              .params({eventId})
                              .defaultOrdering([
                                {field: 'day', direction: 'asc'},
                                {field: 'setTime', direction: 'asc'},
                              ])
                          ),
                      ])
                  )
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      // For event documents, wrap the publish action to handle exclusive active flag
      if (context.schemaType === 'event') {
        return prev.map((action) => {
          if (action.action === 'publish') {
            return createExclusiveActivePublishAction(action)
          }
          return action
        })
      }
      return prev
    },
  },
})

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

  plugins: [structureTool(), visionTool()],

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

import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ce4wb46n',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
    appId: 'q1ha68wjvnlo6fqyiuty912j',
  },
  typegen: {
    enabled: true,
    path: '../csendhaboritas/src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../csendhaboritas/sanity.types.ts',
    overloadClientMethods: true,
  },
})

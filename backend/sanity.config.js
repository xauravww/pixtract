import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'PixTract Project',

  projectId: 'uxsrj2pd',
  dataset: 'productions',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})

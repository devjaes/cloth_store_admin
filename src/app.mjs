import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import mongoose from 'mongoose'
import * as AdminJSMongoose from '@adminjs/mongoose'

import { Category } from './models/category.entity.js'

const PORT = process.env.PORT ?? 3002

const start = async () => {
  const app = express()
  // ... other code
  await mongoose.connect(process.env.MONGODB_URI)
  const adminOptions = {
    // We pass Category to `resources`
    resources: [Category]
  }
  // Please note that some plugins don't need you to create AdminJS instance manually,
  // instead you would just pass `adminOptions` into the plugin directly,
  // an example would be "@adminjs/hapi"
  const admin = new AdminJS(adminOptions)
  // ... other code

  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

// ... other imports

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database
})

start().then(() => {
  console.log('started')
}).catch((err) => {
  console.log(err)
})

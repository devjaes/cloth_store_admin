import * as AdminBroExpress from '@admin-bro/express'
const AdminBro = require('admin-bro')
const AdminBroMongoose = require('@admin-bro/mongoose')

// Register it for mongoose resources
AdminBro.registerAdapter(AdminBroMongoose)

const adminBroOptions = {
    resources: [
        { model: require('../models/userModel'), options: {/* model specific settings */ } }
        // otros modelos...
    ]
    // otras configuraciones...
}

const adminBro = new AdminBro(adminBroOptions)

const router = AdminBroExpress.buildRouter(adminBro)

module.exports = router

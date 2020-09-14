'use strict'

require('dotenv').config()

let express = require('express')

let app = express()

let bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let passtroughHeaders = require('./app/utils/passthroughHeaders')

app.use(passtroughHeaders)

let router = require('./app/routes/api.js')

app.use('/api', router)

app.listen(process.env.SERVER_PORT)
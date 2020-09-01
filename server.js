'use strict'


// let DomainRobot = require("js-domainrobot-sdk").DomainRobot
// console.log(DomainRobot)

require('dotenv').config()

let express = require('express')
let bodyParser = require('body-parser')

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let router = require('./app/routes/api.js')

app.use('/api', router)

app.listen(process.env.SERVER_PORT)
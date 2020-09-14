'use strict'

let DomainRobot = require('js-domainrobot-sdk').DomainRobot

let domainRobot = new DomainRobot({
    url: process.env.DOMAINROBOT_URL,
    auth: {
        user: process.env.DOMAINROBOT_USER,
        password: process.env.DOMAINROBOT_PASSWORD,
        context: process.env.DOMAINROBOT_CONTEXT
    }
})

Object.freeze(domainRobot)

module.exports = domainRobot
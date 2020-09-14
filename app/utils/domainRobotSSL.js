'use strict'

let DomainRobot = require('js-domainrobot-sdk').DomainRobot

let domainRobotSSL = new DomainRobot({
    url: process.env.DOMAINROBOT_URL,
    auth: {
        user: process.env.DOMAINROBOT_SSL_USER,
        password: process.env.DOMAINROBOT_SSL_PASSWORD,
        context: process.env.DOMAINROBOT_SSL_CONTEXT
    }
})

Object.freeze(domainRobotSSL)

module.exports = domainRobotSSL
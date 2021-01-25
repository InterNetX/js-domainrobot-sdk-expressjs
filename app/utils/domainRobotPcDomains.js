'use strict'

let DomainRobot = require('js-domainrobot-sdk').DomainRobot

let domainRobotPcDomains = new DomainRobot({
    url: process.env.DOMAINROBOT_URL + process.env.DOMAINROBOT_URL_PCDOMAINS_SUFFIX,
    auth: {
        user: process.env.DOMAINROBOT_USER,
        password: process.env.DOMAINROBOT_PASSWORD,
        context: process.env.DOMAINROBOT_CONTEXT
    }
})

Object.freeze(domainRobotPcDomains)

module.exports = domainRobotPcDomains
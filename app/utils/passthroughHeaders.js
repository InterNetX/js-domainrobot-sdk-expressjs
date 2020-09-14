'use strict'

let DomainRobotHeaders = require("js-domainrobot-sdk").DomainRobotHeaders
let domainRobot = require('./domainRobot')
let domainRobotSSL = require('./domainRobotSSL')

/**
 * Pass the to the Application sent Headers through to 
 * AutoDNS if they are valid Domainrobot Headers
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * @return function
 */
let passtroughHeaders = function(req, res, next) {

    let headers = req.headers

    let domainRobotConfigHeaders = {}

    for (let [headerKey, headerValue] of Object.entries(headers)) {

        // Dont pass the user-agent and the 
        // content-type Header through
        if (
            headerKey.match(new RegExp('^user-agent$', 'i')) ||
            headerKey.match(new RegExp('^content-type$', 'i'))
        ) {
            continue
        }

        // Search in the DomainRobotHeaders after 
        // the given key of the sent Header
        let searchKey = Object.keys(DomainRobotHeaders).find(key => 
            DomainRobotHeaders[key].match(new RegExp('^' + headerKey + '$', 'i'))
        )

        // If the sent Header Key is an valid 
        // Domainrobot Header assign it 
        if (searchKey) {
            domainRobotConfigHeaders[DomainRobotHeaders[searchKey]] = headerValue
        }
    }

    // Assign the Headers to the domainRobotConfig 
    // of the domainRobot Instances
    domainRobot.domainRobotConfig.headers = domainRobotConfigHeaders
    domainRobotSSL.domainRobotConfig.headers = domainRobotConfigHeaders

    next()
}

module.exports = passtroughHeaders
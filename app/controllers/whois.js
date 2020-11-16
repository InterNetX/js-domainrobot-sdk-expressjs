'use strict'

let { body, check } = require('express-validator')

let DomainRobotModels = require('js-domainrobot-sdk').DomainRobotModels
let domainRobot = require('../utils/domainRobot.js')

/*
    Single Domain Whois Example Request

    GET /api/whois/example.de
*/

/**
 * Single Domain Whois Request
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.single = async function(req, res) {

    let domain = req.params.domain
    
    try {
        let domainRobotResult = await domainRobot.whois().single(domain)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}


/*
    Multiple Domains Whois Example Request

    GET /api/whois
    {
      "domains": [
        "example.de",
        "domain.com",
        "php.net"
      ]
    }
*/

/**
 * Multiple Domains Whois Request
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.multi = async function(req, res) {

    let domains = req.body.domains
    
    try {
        let domainRobotResult = await domainRobot.whois().multi(domains)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}
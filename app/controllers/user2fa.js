'use strict'

let { header } = require('express-validator')

let DomainRobotModels = require('js-domainrobot-sdk').DomainRobotModels
let DomainRobotHeaders = require("js-domainrobot-sdk").DomainRobotHeaders
let domainRobot = require('../utils/domainRobot.js')

exports.tokenRules = function() {
    return [
        header([DomainRobotHeaders.DOMAINROBOT_HEADER_2FA_TOKEN.toLowerCase()])
                                                        .isNumeric()
                                                        .isLength({ min: 6, max: 6 })
    ]
}

/*
    Get 2FA Configuration Example Request

    GET /api/OTPAuth
*/

/**
 * Get Info about the 2FA Configuration
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.tokenConfigInfo = async function(req, res) {

    let token = req.headers[DomainRobotHeaders.DOMAINROBOT_HEADER_2FA_TOKEN.toLowerCase()]
    console.log(domainRobot)
    try {
        let domainRobotResult = await domainRobot.user2fa().tokenConfigInfo()
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Generate 2FA Secret Example Request

    POST /api/OTPAuth
*/

/**
 * Generate 2FA Secret
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.tokenConfigCreate = async function(req, res) {

    try {
        let domainRobotResult = await domainRobot.user2fa().tokenConfigCreate()
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Activate 2FA Authentication Example Request

    PUT /api/user/_2fa
*/

/**
 * Activate the 2FA Authentication
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.tokenConfigActivate = async function(req, res) {

    try {
        let domainRobotResult = await domainRobot.user2fa().tokenConfigActivate()
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Deactivate 2FA Authentication Example Request

    DELETE /api/user/_2fa
*/

/**
 * Deactivate the 2FA Authentication
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.tokenConfigDelete = async function(req, res) {

    try {
        let domainRobotResult = await domainRobot.user2fa().tokenConfigDelete()

        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

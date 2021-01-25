'use strict'

let { body, check } = require('express-validator')

let DomainRobotModels = require('js-domainrobot-sdk').DomainRobotModels
let domainRobotPcDomains = require('../utils/domainRobotPcDomains.js')

exports.estimationRules = function() {
    return [
        body('domains').notEmpty(),
        body('currency').isIn(['USD', 'EUR', 'GBP', 'CNY', 'CHF', 'JPY']),
    ]
}

exports.keywordRules = function() {
    return [
        body('keywords').notEmpty(),
    ]
}

exports.majesticRules = function() {
    return [
        body('domains').notEmpty(),
    ]
}

/*
    Estimation Example Request

    POST /api/estimate
    {
      "domains": [
	    "internetx.com",
		"example.com"
	  ],
      "currency": "EUR"
    }
*/

/**
 * Sends an Estimation Request
 * Estimates the value for the given domain
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.estimation = async function(req, res) {

    let body = req.body

    let estimationModel = new DomainRobotModels.Estimation()

    estimationModel.domains = body.domains
    estimationModel.currency = body.currency

    try {
        let domainRobotResult = await domainRobotPcDomains.pcDomains().estimation(estimationModel)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Alexa Example Request

    GET /api/alexa/{domain}
*/

/**
 * Sends an Alexa Site Info Request
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.alexa = async function(req, res) {

    try {
        let domainRobotResult = await domainRobotPcDomains.pcDomains().alexa(req.params.domain)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Keyword Example Request

    POST /api/keyword
    {
      "keywords": [
        "bicycling",
        "hiking"
      ]
    }
*/

/**
 * Sends an Keyword Request
 * Get Google Ad Words Data
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.keyword = async function(req, res) {

    let body = req.body

    let keywordsModel = new DomainRobotModels.Keywords()
    keywordsModel.keywords = body.keywords

    try {
        let domainRobotResult = await domainRobotPcDomains.pcDomains().keyword(keywordsModel)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Meta Example Request

    GET /api/meta/{domain}
*/

/**
 * Sends an Meta Request
 * Get Meta Information like Online Status, Site Title, Site Description 
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.meta = async function(req, res) {

    try {
        let domainRobotResult = await domainRobotPcDomains.pcDomains().meta(req.params.domain)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Sistrix Example Request

    GET /api/sistrix/{domain}/{country}
*/

/**
 * Sends an Sistrix Request
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.sistrix = async function(req, res) {

    try {
        let domainRobotResult = await domainRobotPcDomains.pcDomains().sistrix(req.params.domain, req.params.country)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Majestic Example Request

    POST /api/keyword
    {
        "domains": [
            "internetx.com"
        ]
    }
*/

/**
 * Sends an Majestic Request
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.majestic = async function(req, res) {

    let body = req.body

    let domainsModel = new DomainRobotModels.Domains()
    domainsModel.domains = body.domains

    try {
        let domainRobotResult = await domainRobotPcDomains.pcDomains().majestic(domainsModel)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Social Media Username Check Example Request

    GET /api/smu_check/{username}
*/

/**
 * Sends an Social Media User Check Request
 * Checks if Username is available on different Social Media Platforms 
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.smuCheck = async function(req, res) {

    try {
        let domainRobotResult = await domainRobotPcDomains.pcDomains().smuCheck(req.params.username)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Wayback Example Request

    GET /api/wayback/{domain}
*/

/**
 * Sends an Wayback Request
 * Retrieve Info from Wayback Snapshot Archive
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.wayback = async function(req, res) {
 
    try {
        let domainRobotResult = await domainRobotPcDomains.pcDomains().wayback(req.params.domain)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}
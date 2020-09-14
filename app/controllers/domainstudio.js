'use strict'

let { body, check } = require('express-validator')

let DomainRobotModels = require('js-domainrobot-sdk').DomainRobotModels
let domainRobot = require('../utils/domainRobot.js')

/*
    Domainstudio search Example Request

    POST /api/domainstudio
    {
      "searchToken": "example.com",
      "currency": "USD"
    }
*/

/**
 * Domainstudio search
 * 
 * Get Information about free Domains, premium Domains 
 * and alternate Domain Names
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.search = async function(req, res) {
    
    let body = req.body

    let domainEnvelopeSearchRequest = new DomainRobotModels.DomainEnvelopeSearchRequest()

    let domainStudioSources = new DomainRobotModels.DomainStudioSources()

    domainStudioSources.initial = new DomainRobotModels.DomainStudioSourceInitial({
        'services': [ 'WHOIS', 'PRICE', 'ESTIMATION' ]
    })

    domainStudioSources.premium = new DomainRobotModels.DomainStudioSourcePremium({
        'max': 5,
        'promoTlds': [ 'rocks', 'shop' ],
        'services': [ 'WHOIS', 'PRICE', 'ESTIMATION' ],
        'topTlds': [ 'de', 'com', 'net' ]
    })

    domainEnvelopeSearchRequest.sources = domainStudioSources
    domainEnvelopeSearchRequest.searchToken = body.searchToken
    domainEnvelopeSearchRequest.currency = body.currency

    try {

        let domainRobotResult = await domainRobot.domainStudio()
                                                .search(domainEnvelopeSearchRequest)
                                                
        res.send(domainRobotResult)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}


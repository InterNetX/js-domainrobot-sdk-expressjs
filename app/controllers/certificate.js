'use strict'

let body = require('express-validator').body

let DomainRobotModels = require('js-domainrobot-sdk').DomainRobotModels
let domainRobotSSL = require('../utils/domainRobotSSL.js')
let generateCsr = require('../utils/generateCsr.js')

exports.createRequestRules = function() {
    return [
        body('name').notEmpty(),
        body('sslcontact_id').isInt()
    ]
}

exports.prepareRequestRules = function() {
    return [
        body('name').notEmpty()
    ]
}

/*
    Create Example Request

    POST /api/certificate
    {
        "name": "domainname.com",
        "sslcontact_id": "2112"
    }
*/

/**
 * Create a Certificate
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.create = async function(req, res) {

    let body = req.body

    let certifcateModel = new DomainRobotModels.Certificate()

    certifcateModel.name = body.name

    // DomainRobotResult
    let sslContactInfo = await domainRobotSSL.sslcontact().info(body.sslcontact_id)
    
    let sslContact = sslContactInfo.result.data[0]

    certifcateModel.adminContact = sslContact
    certifcateModel.technicalContact = sslContact

    certifcateModel.product = 'SSL123'
    certifcateModel.lifetime = new DomainRobotModels.TimePeriod({
        'unit': 'MONTH', // "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR"
        'period': 12
    })

    certifcateModel.authentication = new DomainRobotModels.CertAuthentication({
        'method': 'FILE' // "DNS" | "EMAIL" | "FILE" | "ORG"
    })

    certifcateModel.csr = generateCsr(body.name)

    try {
        let domainRobotResult = await domainRobotSSL.certificate().create(certifcateModel)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Create Realtime Example Request

    POST /api/certificate/_realtime
    {
        "name": "domainname.com",
        "sslcontact_id": "2112"
    }
*/

/**
 * Create a Certificate in realtime
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.createRealtime = async function(req, res) {
    
    let body = req.body

    let certifcateModel = new DomainRobotModels.Certificate()

    certifcateModel.name = body.name

    // DomainRobotResult
    let sslContactInfo = await domainRobotSSL.sslcontact().info(body.sslcontact_id)

    let sslContact = sslContactInfo.result.data[0]

    certifcateModel.adminContact = sslContact
    certifcateModel.technicalContact = sslContact

    certifcateModel.product = 'SSL123'
    certifcateModel.lifetime = new DomainRobotModels.TimePeriod({
        'unit': 'MONTH', // "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR"
        'period': 12
    })

    certifcateModel.authentication = new DomainRobotModels.CertAuthentication({
        'method': 'FILE' // "DNS" | "EMAIL" | "FILE" | "ORG"
    })

    certifcateModel.csr = generateCsr(body.name)

    try {
        let domainRobotResult = await domainRobotSSL.certificate().createRealtime(certifcateModel)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Prepare Order Example Request

    POST /api/certificate/_prepareOrder
    {
        "name": "domainname.com"
    }
*/

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.prepareOrder = async function(req, res) {
    
    let body = req.body

    let certifcateDataModel = new DomainRobotModels.CertificateData()

    certifcateDataModel.name = body.name

    certifcateDataModel.product = 'SSL123'

    let csr = generateCsr(body.name);

    certifcateDataModel.csr = csr

    try {
        let domainRobotResult = await domainRobotSSL.certificate().prepareOrder(certifcateDataModel)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Read Example Request

    GET /api/certificate/{id}
*/

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.info = async function(req, res) {

    try {
        let domainRobotResult = await domainRobotSSL.certificate().info(req.params.id)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Delete Example Request

    DELETE /api/certificate/{id}
*/

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.delete = async function(req, res) {
    
    try {
        let domainRobotResult = await domainRobotSSL.certificate().delete(req.params.id)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    List Example Request

    POST /api/certificate/_search
    {
        "filters": [
            {
                "key": "name",
                "value": "%domain%",
                "operator": "LIKE"
            }
        ]  
    }
*/

/**
 * List Certificates
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.list = async function(req, res) {
    
    let body = req.body

    try {

        let filters = []

        body.filters.forEach(function(filter) {
            filters.push(new DomainRobotModels.QueryFilter(filter))
        })

        let query = new DomainRobotModels.Query({
            'filters': filters,
            'view': new DomainRobotModels.QueryView({
                'children': true,
                'limit': '10'
            })
        });

        let domainRobotResult = await domainRobotSSL.certificate().list(query)
        res.send(domainRobotResult)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}
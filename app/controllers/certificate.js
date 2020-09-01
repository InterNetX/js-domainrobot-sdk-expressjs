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

exports.create = async function(req, res) {

    let body = req.body

    let certifcateModel = new DomainRobotModels.Certificate()

    certifcateModel.name = body.name

    let domainRobotResult = await domainRobotSSL.sslcontact().info(body.sslcontact_id)
    
    let sslContact = domainRobotResult.result.data[0]

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

    let result

    try {
        result = await domainRobotSSL.certificate().create(certifcateModel)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.createRealtime = async function(req, res) {
    
    let body = req.body

    let certifcateModel = new DomainRobotModels.Certificate()

    certifcateModel.name = body.name

    let domainRobotResult = await domainRobotSSL.sslcontact().info(body.sslcontact_id)

    let sslContact = domainRobotResult.result.data[0]

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

    let result

    try {
        result = await domainRobotSSL.certificate().createRealtime(certifcateModel)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.prepareOrder = async function(req, res) {
    
    let body = req.body

    let certifcateDataModel = new DomainRobotModels.CertificateData()

    certifcateDataModel.name = body.name

    certifcateDataModel.product = 'SSL123'

    let csr = generateCsr(body.name);

    certifcateDataModel.csr = csr

    let result

    try {
        result = await domainRobotSSL.certificate().prepareOrder(certifcateDataModel)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.info = async function(req, res) {
    
    let result

    try {
        result = await domainRobotSSL.certificate().info(req.params.id)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.delete = async function(req, res) {
    
    let result

    try {
        result = await domainRobotSSL.certificate().delete(req.params.id)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.list = async function(req, res) {
    
    let body = req.body

    let result

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

        result = await domainRobotSSL.certificate().list(query)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}
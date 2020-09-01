'use strict'

let body = require('express-validator').body

let DomainRobotModels = require('js-domainrobot-sdk').DomainRobotModels
let domainRobotSSL = require('../utils/domainRobotSSL.js')

exports.requestRules = function() {
    return [
        body('city').notEmpty(),
        body('state').notEmpty(),
        body('title').notEmpty(),
        body('street_no').notEmpty(),
        body('fname').notEmpty(),
        body('lname').notEmpty(),
        body('pcode').notEmpty()
    ]
}

exports.create = async function(req, res) {

    let body = req.body

    let sslContactModel = new DomainRobotModels.SslContact()

    sslContactModel.organization = body.organization ?? null
    sslContactModel.city = body.city ?? null
    sslContactModel.state = body.state ?? null
    sslContactModel.country = body.country ?? null
    sslContactModel.address = [
        body.street_no ?? null, 
        body.address_info ?? null
    ];
    sslContactModel.pcode = body.pcode ?? null
    sslContactModel.title = body.title ?? null
    sslContactModel.fname = body.fname ?? null
    sslContactModel.lname = body.lname ?? null
    sslContactModel.email = body.email ?? null
    sslContactModel.phone = body.phone ?? null
    sslContactModel.fax = body.fax ?? null

    let result

    try {
        result = await domainRobotSSL.sslcontact().create(sslContactModel)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.info = async function(req, res) {

    let result

    try {
        result = await domainRobotSSL.sslcontact().info(req.params.id)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.update = async function(req, res) {

    let body = req.body

    let result

    try {

        let domainRobotResult = await domainRobotSSL.sslcontact().info(req.params.id)

        let sslContact = domainRobotResult.result.data[0]

        if (body.organization) {
            sslContact.organization = body.organization
        }

        if (body.city) {
            sslContact.city = body.city
        }

        if (body.state) {
            sslContact.state = body.state
        }

        if (body.country) {
            sslContact.country = body.country
        }

        if (body.street_no) {
            sslContact.address = [
                body.street_no,
                body.address_info ?? ''
            ]
        }
        
        if (body.pcode) {
            sslContact.pcode = body.pcode
        }

        if (body.title) {
            sslContact.title = body.title
        }

        if (body.fname) {
            sslContact.fname = body.fname
        }

        if (body.lname) {
            sslContact.lname = body.lname
        }

        if (body.email) {
            sslContact.email = body.email
        }

        if (body.phone) {
            sslContact.phone = body.phone
        }

        if (body.fax) {
            sslContact.fax = body.fax
        }

        result = await domainRobotSSL.sslcontact().update(sslContact)

    } catch(DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.delete = async function(req, res) {

    let result

    try {
        result = await domainRobotSSL.sslcontact().delete(req.params.id)
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

        result = await domainRobotSSL.sslcontact().list(query)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}
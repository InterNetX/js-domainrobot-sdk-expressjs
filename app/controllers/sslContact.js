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

/*
    Create Example Request

    POST /api/sslcontact
    {
      "organization": "InterNetX GmbH",
      "city": "Regensburg",
      "state": "Bavaria",
      "country": "DE",
      "street_no": "Johanna-Dachs-Straße 55",
      "address_info": "Second Floor",
      "pcode": "93055",
      "title": "Mr.",
      "fname": "John",
      "lname": "Doe",
      "email": "john.doe@internetx.com",
      "phone": "+49 123 45678",
      "fax": "+49 123 45679"
    }
*/

/**
 * Create an SslContact
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
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

    try {
        let domainRobotResult = await domainRobotSSL.sslcontact().create(sslContactModel)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Read Example Request

    GET /api/sslcontact/{id}
*/

/**
 * Get an SslContact Info
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.info = async function(req, res) {

    try {
        let domainRobotResult = await domainRobotSSL.sslcontact().info(req.params.id)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Update Example Request

    PUT /api/sslcontact/{id}
    {
      "address_info": "Third Floor",
      "title": "Mrs.",
      "fname": "Jane",
      "email": "jane.doe@internetx.com",
      "phone": "+49 321 45678"
    }
*/

/**
 * Update an existing Contact
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.update = async function(req, res) {

    let body = req.body

    try {

        // DomainRobotResult
        let sslContactInfo = await domainRobotSSL.sslcontact().info(req.params.id)

        let sslContact = sslContactInfo.result.data[0]

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

        let domainRobotResult = await domainRobotSSL.sslcontact().update(sslContact)
        res.send(domainRobotResult)

    } catch(DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Delete Example Request

    DELETE /api/sslcontact/{id}
*/

/**
 * Delete an existing SslContact
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.delete = async function(req, res) {

    try {
        let domainRobotResult = await domainRobotSSL.sslcontact().delete(req.params.id)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    List Example Request

    POST /api/sslcontact/_search
    {
      "filters": [
        {
          "key": "id",
          "value": "2110",
          "operator": "GREATER"
        },
        {
          "key": "organization",
          "value": "InterNetX%",
          "operator": "LIKE"
        }
      ]
    }
*/

/**
 * List SslContact
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

        let domainRobotResult = await domainRobotSSL.sslcontact().list(query)
        res.send(domainRobotResult)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}
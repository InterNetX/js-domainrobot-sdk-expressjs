'use strict'

let body = require('express-validator').body

let DomainRobotModels = require('js-domainrobot-sdk').DomainRobotModels
let domainRobot = require('../utils/domainRobot.js')

exports.requestRules = function() {
    return [
        body('type').isIn(['PERSON', 'ORG', 'ROLE']),
        body('city').notEmpty(),
        body('country').notEmpty(),
        body('pcode').notEmpty(),
        body('lname').notEmpty()
    ]
}

/*
    Create Example Request

    POST /api/contact
    {
      "type": "PERSON",
      "alias": "SOMEALIAS",
      "city": "Regensburg",
      "country": "DE",
      "state": "",
      "street_no": "Johanna-Dachs-Straße 55",
      "address_info": "ADDITIONAL INFO",
      "pcode": "93055",
      "fname": "SOME FIRSTNAME",
      "lname": "SOME LASTNAME",
      "email": "SOME@MAIL.COM",
      "phone": "",
      "commment": "SOME COMMENTS"
    }
*/

/**
 * Create an Contact
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.create = async function(req, res) {

    let keys = []
    if (
        req.query.keys &&
        Array.isArray(req.query.keys)
    ) {
        keys = req.query.keys
    }

    let body = req.body

    let contactModel = new DomainRobotModels.Contact()

    contactModel.type = body.type;

    if ( req.body === 'ORG' ) {
        contactModel.organization = body.organization
    }

    contactModel.alias = body.alias ?? null
    contactModel.city = body.city ?? null
    contactModel.country = body.country ?? null
    contactModel.state = body.state ?? null
    contactModel.address = [
        body.street_no ?? null, 
        body.address_info ?? null
    ];
    contactModel.pcode = body.pcode ?? null
    contactModel.fname = body.fname ?? null
    contactModel.lname = body.lname ?? null
    contactModel.email = body.email ?? null
    contactModel.phone = body.phone ?? null
    contactModel.fax = body.fax ?? null
    contactModel.comment = body.comment ?? null

    // set nic references if desired
    contactModel.nicRef = [
        new DomainRobotModels.ContactReference({
            nic: new DomainRobotModels.NicMember({
                'label': 'tld' // e.g. de,com,cloud etc.
            })
        })
    ]

    // Overview of all Contact Extensions
    // https://help.internetx.com/display/APIXMLEN/Contact+Extensions
    contactModel.extensions = {
        general: new DomainRobotModels.ContactGeneralExtensions({
            gender: 'MALE'
        }),
        it: new DomainRobotModels.ContactItExtensions({
            'entityType': 1 // Italian and foreign natural persons
        })
    }

    if (body.confirm_owner_consent) {
        contactModel.confirmOwnerConsent = body.confirm_owner_consent
    }

    try {
        let domainRobotResult = await domainRobot.contact().create(contactModel, keys)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Read Example Request

    GET /api/contact/{id}
*/

/**
 * Get an Contact Info
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.info = async function(req, res) {

    try {
        let domainRobotResult = await domainRobot.contact().info(req.params.id)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Update Example Request

    PUT /api/contact/{id}
    {
      "alias": "NEWALIAS",
      "city": "Regensburg",
      "country": "DE",
      "state": "Bayern",
      "street_no": "Johanna-Dachs-Straße 55",
      "address_info": "ADDITIONAL INFO",
      "pcode": "93055",
      "fname": "SOME FIRSTNAME",
      "email": "SOME@MAIL.COM",
      "phone": "",
      "commment": "SOME COMMENTS"
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
        let contactInfo = await domainRobot.contact().info(req.params.id)

        let contact = contactInfo.result.data[0]

        if (body.alias) {
            contact.alias = body.alias
        }

        if (body.city) {
            contact.city = body.city
        }

        if (body.country) {
            contact.country = body.country
        }

        if (body.state) {
            contact.state = body.state
        }

        if (body.street_no) {
            contact.address = [
                body.street_no,
                body.address_info ?? ''
            ]
        }
        
        if (body.pcode) {
            contact.pcode = body.pcode
        }

        if (body.fname) {
            contact.fname = body.fname
        }

        if (body.lname) {
            contact.lname = body.lname
        }

        if (body.email) {
            contact.email = body.email
        }

        if (body.phone) {
            contact.phone = body.phone
        }

        if (body.fax) {
            contact.fax = body.fax
        }

        if (body.comment) {
            contact.comment = body.comment
        }

        // Overview of all Contact Extensions
        // https://help.internetx.com/display/APIXMLEN/Contact+Extensions
        contact.extensions = {
            it: new DomainRobotModels.ContactItExtensions({
                'entityType': 2 // Italian and foreign natural persons
            })
        }

        if (body.confirm_owner_consent) {
            contact.confirmOwnerConsent = body.confirm_owner_consent
        }

        let domainRobotResult = await domainRobot.contact().update(contact)
        res.send(domainRobotResult)

    } catch(DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Delete Example Request

    DELETE /api/contact/{id}
*/

/**
 * Delete an existing Contact
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.delete = async function(req, res) {

    try {
        let domainRobotResult = await domainRobot.contact().delete(req.params.id)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    List Example Request

    POST /api/contact/_search
    {
      "filters": [
        {
          "key": "fname",
          "value": "First%",
          "operator": "LIKE"
        },
        {
          "key": "lname",
          "value": "%name%",
          "operator": "NOT_LIKE"
        }
      ]
    }
*/

/**
 * List Contact
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

        let domainRobotResult = await domainRobot.contact().list(query)
        res.send(domainRobotResult)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}
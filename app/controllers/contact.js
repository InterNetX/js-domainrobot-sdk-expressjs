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

exports.create = async function(req, res) {

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

    let result

    try {
        result = await domainRobot.contact().create(contactModel)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.info = async function(req, res) {

    let result

    try {
        result = await domainRobot.contact().info(req.params.id)
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

        let domainRobotResult = await domainRobot.contact().info(req.params.id)

        let contact = domainRobotResult.result.data[0]

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

        result = await domainRobot.contact().update(contact)

    } catch(DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.delete = async function(req, res) {

    let result

    try {
        result = await domainRobot.contact().delete(req.params.id)
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

        result = await domainRobot.contact().list(query)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}
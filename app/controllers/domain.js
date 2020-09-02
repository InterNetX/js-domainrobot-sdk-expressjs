'use strict'

let { body, check } = require('express-validator')

let DomainRobotModels = require('js-domainrobot-sdk').DomainRobotModels
let domainRobot = require('../utils/domainRobot.js')

exports.requestRules = function() {
    return [
        check('name').isFQDN(), // name can be in the request route and also in the request body so check both
        body('nameservers').optional().custom(arr => arr instanceof Array && arr.length > 1 && arr.length < 5 ),
        body('contact_id').optional().isInt()
    ]
}

/*
    Create Example Request

    POST /api/domain
    {
      "name": "sdk-autodns.com",
      "nameservers": [
	    "ns1.example.com",
		"ns2.example.com",
		"ns3.example.com",
		"ns4.example.com"
	  ],
      "contact_id": "23250350"
    }
*/

/**
 * Create an Domain
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.create = async function(req, res) {
    
    let body = req.body

    try {

        let domainModel = new DomainRobotModels.Domain()

        domainModel.name = body.name

        if (body.nameservers) {

            let nameservers = []
            body.nameservers.forEach(function(nameserver) {
                nameservers.push(new DomainRobotModels.NameServer({
                    'name': nameserver
                }))
            })

            domainModel.nameservers = nameservers
        }

        if (body.contact_id) {

            // DomainRobotResult
            let contactInfo = await domainRobot.contact().info(body.contact_id)

            let contact = contactInfo.result.data[0]
        
            domainModel.adminc = contact
            domainModel.ownerc = contact
            domainModel.techc = contact
            domainModel.zonec = contact
        }

        let domainRobotResult = await domainRobot.domain().create(domainModel)
        res.send(domainRobotResult)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Read Example Request

    GET /api/domain/{name}
*/

/**
 * Get an Domain Info
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.info = async function(req, res) {

    try {
        let domainRobotResult = await domainRobot.domain().info(req.params.name)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Update Example Request

    PUT /api/domain/{name}
    {
      "comment": "SOME DOMAIN COMMENT",
      "nameservers": [
	    "ns1.example.de",
		"ns2.example.de",
		"ns3.example.de"
      ],
      "confirm_owner_consent": true,
      "contact_id": "23249337",
      "generalRequestEmail": "request@mail.com"
    }
*/


/**
 * Update Domain Data
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.update = async function(req, res) {

    let body = req.body

    try {

        // DomainRobotResult
        let domainInfo = await domainRobot.domain().info(req.params.name)

        let domain = domainInfo.result.data[0]

        if (body.comment) {
            domain.comment = body.comment
        }

        if (body.nameservers) {

            let nameservers = []
            body.nameservers.forEach(function(nameserver) {
                nameservers.push(new DomainRobotModels.NameServer({
                    'name': nameserver
                }))
            })
        
            domain.nameservers = nameservers
        }

        // Confirms the consent of the domainowner for the changes. 
        // Required for gTLDs and new gTLDs when changing the name, the email address or the organization of the domain owner.
        if (body.confirm_owner_conscent) {
            domain.confirmOwnerConsent = body.confirm_owner_conscent
        }

        if (body.contact_id) {

            let contactInfo = await domainRobot.contact().info(body.contact_id)

            let contact = contactInfo.result.data[0]
        
            domain.adminc = contact
            domain.ownerc = contact
            domain.techc = contact
            domain.zonec = contact
        }

        if (body.general_request_email) {
            domain.generalRequestEmail = body.general_request_email
        }

        let domainRobotResult = await domainRobot.domain().update(domain)
        res.send(domainRobotResult)

    } catch(DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    List Example Request

    POST /api/domain/_search
    {
      "filters": [
        {
          "key": "name",
          "value": "%.de",
          "operator": "LIKE"
        },
	    {
          "key": "created",
          "value": "2020-08-10T00:00:00.000+0200",
          "operator": "GREATER"
        }
      ]  
    }
*/

/**
 * List Domains
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

        let domainRobotResult = await domainRobot.domain().list(query)
        res.send(domainRobotResult)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Create Authinfo1 Example Request

    POST /api/domain/{name}/_authinfo1
*/

/**
 * Create Domain Authinfo1
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.createAuthinfo1 = async function(req, res) {

    try {
        let domainRobotResult = await domainRobot.domain().authInfo1Create(req.params.name)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }    
}

/*
    Delete Authinfo1 Example Request

    DELETE /api/domain/{name}/_authinfo1
*/


/**
 * Delete Domain Authinfo1
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.deleteAuthinfo1 = async function(req, res) {

    try {
        let domainRobotResult = await domainRobot.domain().authInfo1Delete(req.params.name)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Create Authinfo2 Example Request

    POST /api/domain/{name}/_authinfo2
*/

/**
 * Create Domain Authinfo2
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.createAuthinfo2 = async function(req, res) {

    try {
        let domainRobotResult = await domainRobot.domain().authInfo2Create(req.params.name)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Renew Domain Example Request

    PUT /api/domain/{name}/_renew
*/

/**
 * Renew Domain
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.renew = async function(req, res) {

    try {

        // DomainRobotResult
        let contactInfo = await domainRobot.domain().info(req.params.name)

        let domain = contactInfo.result.data[0]
        
        let domainRobotResult = await domainRobot.domain().renew(domain)
        res.send(domainRobotResult)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Restore Domain Example Request

    PUT /api/domain/{name}/_restore
    {
      "nameservers": [
	    "ns1.example.de",
		"ns2.example.de"
      ],
      "contact_id": "23249337"
    }
*/

/**
 * Restore Domain
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.restore = async function(req, res) {
    
    let body = req.body

    try {

        let domainRestoreModel = new DomainRobotModels.DomainRestore()

        domainRestoreModel.name = req.params.name

        if (body.nameservers) {

            let nameservers = []
            body.nameservers.forEach(function(nameserver) {
                nameservers.push(new DomainRobotModels.NameServer({
                    'name': nameserver
                }))
            })

            domainRestoreModel.nameservers = nameservers
        }

        if (body.contact_id) {

            // DomainRobotResult
            let contactInfo = await domainRobot.contact().info(body.contact_id)

            let contact = contactInfo.result.data[0]
        
            domainRestoreModel.adminc = contact
            domainRestoreModel.ownerc = contact
            domainRestoreModel.techc = contact
            domainRestoreModel.zonec = contact
        }

        let domainRobotResult = await domainRobot.domain().restore(domainRestoreModel)
        res.send(domainRobotResult)
        
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Domain Restore List Request

    POST /api/domain/restore/_search
    {
      "filters": [
        {
          "key": "name",
          "value": "%.de",
          "operator": "LIKE"
        }
      ]
    }
*/

/**
 * Domain Restore List
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.restoreList = async function(req, res) {
    
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

        let domainRobotResult = await domainRobot.domain().restoreList(query)
        res.send(domainRobotResult)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Transfer Domain Example Request

    POST /api/domain/_transfer
    {
      "name": "",
      "nameservers": [
	    "ns1.example.de",
		"ns2.example.de"
      ],
      "contact_id": "23249337"
    }
*/

/**
 * Transfer Domain
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.transfer = async function(req, res) {
    
    let body = req.body

    try {

        let domainModel = new DomainRobotModels.Domain()

        domainModel.name = body.name

        if (body.nameservers) {

            let nameservers = []
            body.nameservers.forEach(function(nameserver) {
                nameservers.push(new DomainRobotModels.NameServer({
                    'name': nameserver
                }))
            })

            domainModel.nameservers = nameservers
        }

        if (body.contact_id) {

            // DomainRobotResult
            let contactInfo = await domainRobot.contact().info(body.contact_id)

            let contact = contactInfo.result.data[0]
        
            domainModel.adminc = contact
            domainModel.ownerc = contact
            domainModel.techc = contact
            domainModel.zonec = contact
        }

        let domainRobotResult = await domainRobot.domain().transfer(domainModel)
        res.send(domainRobotResult)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

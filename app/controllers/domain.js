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

exports.create = async function(req, res) {
    
    let body = req.body

    let result

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

            let domainRobotResult = await domainRobot.contact().info(body.contact_id)

            let contact = domainRobotResult.result.data[0]
        
            domainModel.adminc = contact
            domainModel.ownerc = contact
            domainModel.techc = contact
            domainModel.zonec = contact
        }

        result = await domainRobot.domain().create(domainModel)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.info = async function(req, res) {

    let result

    try {
        result = await domainRobot.domain().info(req.params.name)
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

        let domainRobotResult = await domainRobot.domain().info(req.params.name)

        let domain = domainRobotResult.result.data[0]

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

            let domainRobotResult = await domainRobot.contact().info(body.contact_id)

            let contact = domainRobotResult.result.data[0]
        
            domain.adminc = contact
            domain.ownerc = contact
            domain.techc = contact
            domain.zonec = contact
        }

        if (body.general_request_email) {
            domain.generalRequestEmail = body.general_request_email
        }

        result = await domainRobot.domain().update(domain)

    } catch(DomainRobotException) {
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

        result = await domainRobot.domain().list(query)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.createAuthinfo1 = async function(req, res) {
    
    let result

    try {
        result = await domainRobot.domain().authInfo1Create(req.params.name)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.deleteAuthinfo1 = async function(req, res) {

    let result

    try {
        result = await domainRobot.domain().authInfo1Delete(req.params.name)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.createAuthinfo2 = async function(req, res) {
    
    let result

    try {
        result = await domainRobot.domain().authInfo2Create(req.params.name)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.renew = async function(req, res) {

    let result

    try {

        let domainRobotResult = await domainRobot.domain().info(req.params.name)

        let domain = domainRobotResult.result.data[0]
        
        result = await domainRobot.domain().renew(domain)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.restore = async function(req, res) {
    
    let body = req.body

    let result

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

            let domainRobotResult = await domainRobot.contact().info(body.contact_id)

            let contact = domainRobotResult.result.data[0]
        
            domainRestoreModel.adminc = contact
            domainRestoreModel.ownerc = contact
            domainRestoreModel.techc = contact
            domainRestoreModel.zonec = contact
        }

        result = await domainRobot.domain().restore(domainRestoreModel)
        

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.restoreList = async function(req, res) {
    
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

        result = await domainRobot.domain().restoreList(query)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

exports.transfer = async function(req, res) {
    
    let body = req.body

    let result

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

            let domainRobotResult = await domainRobot.contact().info(body.contact_id)

            let contact = domainRobotResult.result.data[0]
        
            domainModel.adminc = contact
            domainModel.ownerc = contact
            domainModel.techc = contact
            domainModel.zonec = contact
        }

        result = await domainRobot.domain().transfer(domainModel)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}

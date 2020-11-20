'use strict'

let { body, check } = require('express-validator')

let DomainRobotModels = require('js-domainrobot-sdk').DomainRobotModels
let domainRobot = require('../utils/domainRobot.js')

/*
Estimation Example Request

PATCH /bulk/domain
{
    "domains": [
    {
        "name": "example.com",
        "nameservers": [
            {
            "name": "ns1.example.com",
            "ipAddresses": [
                "111.112.113.114"
            ]
            },
            {
            "name": "ns2.example.com",
            "ipAddresses": [
                "211.212.213.214"
            ]
            }
    ],
    "confirm_owner_consent": true,
    "ownerc_contact_id": 23234103
},
{
    "name": "example.de",
    "nameservers": [
        {
        "name": "ns1.example.de",
        "ipAddresses": [
            "112.113.114.115"
        ]
        },
        {
        "name": "ns2.example.de",
        "ipAddresses": [
            "212.213.214.215"
        ]
        }
    ],
    "confirm_owner_consent": true,
    "ownerc_contact_id": 23234102
}
*/

/**
 * Sends an Bulk Domain Update
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.update = async function(req, res) {

    let body = req.body

    try {

        let domains = []
        for (let x = 0; x < body.domains.length; x++) {

            let domain = body.domains[x]

            let domainInfo = await domainRobot.domain().info(domain.name)
            let domainObj = domainInfo.result.data[0]

            if (domain.nameservers) {
                let nameServers = []

                domain.nameservers.forEach(function(nameserver) {
                    nameServers.push(
                        new DomainRobotModels.NameServer({
                            'name': nameserver.name,
                            'ipAddresses': nameserver.ipAddresses
                        })
                    )
                })

                domainObj.nameservers = nameServers
            }

            if (
                body.confirm_owner_consent && 
                body.ownerc_contact_id
            ) {
                domainObj.confirmOwnerConsent = body.confirm_owner_consent

                let contactInfo = await domainRobot.contact().info(body.ownerc_contact_id)
                let contactObj = contactInfo.result.data[0]

                domainObj.ownerc = contactObj
            }

            domains.push(domainObj)
        }

        let bulkDomainPatchRequest = new DomainRobotModels.BulkDomainPatchRequest();
        bulkDomainPatchRequest.objects = domains
    
        let domainRobotResult = await domainRobot.domainBulk().update(bulkDomainPatchRequest)
        res.send(domainRobotResult)
        
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

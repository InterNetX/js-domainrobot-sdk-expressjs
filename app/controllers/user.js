'use strict'

let { body, check } = require('express-validator')

let DomainRobotModels = require('js-domainrobot-sdk').DomainRobotModels
let domainRobot = require('../utils/domainRobot.js')

exports.requestRules = function() {
    return [
        check('username').notEmpty(), // name can be in the request route and also in the request body so check both
        body('contact_id').isInt()
    ]
}

exports.info = async function(req, res) {

    let result

    try {
        result = await domainRobot.user().info(req.params.name, req.params.context)
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

        result = await domainRobot.user().list(query)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        result = DomainRobotException
    }

    res.send(result)
}
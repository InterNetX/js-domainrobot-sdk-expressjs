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

/*
    Read Example Request

    GET /api/user/{username}/{context}
*/

/**
 * Get an User Info
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.info = async function(req, res) {

    try {
        let domainRobotResult = await domainRobot.user().info(req.params.username, req.params.context)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    List Example Request

    POST /api/user/_search
    {
      "filters": [
        {
          "key": "status",
          "value": "2",
          "operator": "EQUAL"
        }
      ]
    }
*/

/**
 * List User
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

        let domainRobotResult = await domainRobot.user().list(query)
        res.send(domainRobotResult)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}
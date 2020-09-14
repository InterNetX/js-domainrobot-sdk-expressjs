'use strict'

let { body, check, param } = require('express-validator')

let DomainRobotModels = require('js-domainrobot-sdk').DomainRobotModels
let DomainRobotHeaders = require("js-domainrobot-sdk").DomainRobotHeaders
let domainRobot = require('../utils/domainRobot.js')

exports.createRequestRules = function() {
    return [
        check('user').notEmpty(),
        check('context').optional().isInt(),
        check('defaultEmail').isEmail()
    ]
}

exports.requestRules = function() {
    return [
        check('user').notEmpty(),
        check('context').isInt()
    ]
}

exports.copyRequestRules = function() {
    return [
        param('user').notEmpty(),
        param('context').isInt(),
        body('user').notEmpty(),
        body('defaultEmail').isEmail()
    ]
}

/*
    Create Example Request

    POST /api/user
    {
      "user": "autodns-user",
      "defaultEmail": "autodns-user@internetx.com",
      "password": "secret123",
      "details": {
          "fname": "firstname",
          "lname": "lastname",
          "organization": "InterNetX GmbH",
          "phone": "+49 941 12345-67"
          "passwordResetEmail": ""
      }
    }
*/

/**
 * Create an User
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.create = async function(req, res) {

    let body = req.body

    let user = new DomainRobotModels.User()

    user.user = body.user
    user.context = body.context ?? null
    user.defaultEmail = body.defaultEmail
    user.password = body.password ?? null

    if (
        user.details &&
        user.details.constructor === Object &&
        Object.keys(user.details).length > 0
    ) {
        user.details = new DomainRobotModels.UserDetails({
            'fname': body.detail.fname ?? null,
            'lname': body.detail.lname ?? null,
            'organization': body.detail.organization ?? null,
            'phone': body.detail.phone ?? null,
            'passwordResetEmail': body.detail.passwordResetEmail ?? null
        })
    }

    try {
        let domainRobotResult = await domainRobot.user().create(user)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Read Example Request

    GET /api/user/{username}/{context}?acl&profiles&customer&subscription&nameServerGroup
*/

/**
 * Get an User Info
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.info = async function(req, res) {

    let params = req.params

    let queries = []
    for (const [key, value] of Object.entries(req.query)) {
        queries.push(key)
    }

    try {
        let domainRobotResult = await domainRobot.user().info(params.user, params.context, queries)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Update Example Request

    PUT /api/user/{username}/{context}
    {
      "defaultEmail": "autodns-user@internetx.xyz",
      "password": "abc123"
    }
*/

/**
 * Update an existing User
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.update = async function(req, res) {

    let params = req.params
    let body = req.body

    try {

        // DomainRobotResult
        let userInfo = await domainRobot.user().info(params.user, params.context)

        let user = userInfo.result.data[0]

        if (body.user) {
            user.user = body.user
        }

        if (body.context) {
            user.context = body.context
        }
        
        if (body.defaultEmail) {
            user.defaultEmail = body.defaultEmail
        }

        if (body.password) {
            user.password = body.password
        }

        if (
            user.details &&
            user.details.constructor === Object &&
            Object.keys(user.details).length > 0
        ) {
            user.details = new DomainRobotModels.UserDetails();
            
            if (body.detail.fname) {
                user.details.fname = body.detail.fname
            }

            if (body.detail.lname) {
                user.details.lname = body.detail.lname
            }

            if (body.detail.organization) {
                user.details.organization = body.detail.organization
            }

            if (body.detail.phone) {
                user.details.phone = body.detail.phone
            }

            if (body.detail.passwordResetEmail) {
                user.details.passwordResetEmail = body.detail.passwordResetEmail
            }
        }

        let domainRobotResult = await domainRobot.user().update(user)
        res.send(domainRobotResult)

    } catch(DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Delete Example Request

    DELETE /api/user/{username}/{context}
*/

/**
 * Delete an User
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.delete = async function(req, res) {

    let params = req.params

    try {
        let domainRobotResult = await domainRobot.user().delete(params.user, params.context)
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

/*
    Inquiring the Billing Limit Example Request

    GET /api/user/billinglimit
*/

/**
 * Inquiring the Billing Limit for the User
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.billingObjectLimitInfo = async function(req, res) {

    let keys = []
    if (
        req.query.keys &&
        Array.isArray(req.query.keys)
    ) {
        keys = req.query.keys
    }

    let articleTypes = []
    if (
        req.query.articleTypes &&
        Array.isArray(req.query.articleTypes)
    ) {
        articleTypes = req.query.articleTypes
    }

    try {
        let domainRobotResult = await domainRobot.user().billingObjectLimitInfo(keys, articleTypes)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Inquiring the Billing Terms Example Request

    GET /api/user/billingterm
*/

/**
 *  Inquiring the Billing Terms for the User
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.billingObjectTermsInfo = async function(req, res) {

    try {
        let domainRobotResult = await domainRobot.user().billingObjectTermsInfo()
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Lock Example Request

    PUT /api/user/{username}/{context}/_lock
*/

/**
 * Lock an User
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.updateLock = async function(req, res) {

    let params = req.params

    let keys = []
    if (
        req.query.keys &&
        Array.isArray(req.query.keys)
    ) {
        keys = req.query.keys
    }

    try {
        let domainRobotResult = await domainRobot.user().updateLock(params.user, params.context, keys)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Unlock Example Request

    PUT /api/user/{username}/{context}/_unlock
*/

/**
 * Unlock an User
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.updateUnlock = async function(req, res) {

    let params = req.params

    let keys = []
    if (
        req.query.keys &&
        Array.isArray(req.query.keys)
    ) {
        keys = req.query.keys
    }

    try {
        let domainRobotResult = await domainRobot.user().updateUnlock(params.user, params.context, keys)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Copy User Example Request

    POST /api/user/{username}/{context}/copy
    {
      "user": "new-username",
      "defaultEmail": "new-username@mail.com",
      "password": "abcdef123456"
    }
*/

/**
 * Copy an User
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.copy = async function(req, res) {

    let params = req.params
    let body = req.body

    try {

        let userInfo = await domainRobot.user().info(params.user, params.context)

        let user = userInfo.result.data[0]

        user.user = body.user

        user.defaultEmail = body.defaultEmail

        if (body.password) {
            user.password = body.password
        }
        
        let domainRobotResult = await domainRobot.user().copy(params.user, params.context, user)

        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    User Profile Info Example Request

    GET /api/user/{username}/{context}/profile
*/

/**
 * Get an User Profile Info
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.profileInfo = async function(req, res) {

    let params = req.params

    let prefix = ''
    if (params.prefix) {
        prefix = params.prefix
    }

    try {
        let domainRobotResult = await domainRobot.user().profileInfo(params.user, params.context, prefix)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Update User Profile Example Request

    PUT /api/user/{username}/{context}/profile
    {
        "profiles": [
          {
            "key": "domain_nserver1",
            "value": "ns1.example.com",
            "flag": "RECURSE",
            "readonly": false
          },
          {
            "key": "domain_nserver2",
            "value": "ns2.example.com",
            "flag": "RECURSE",
            "readonly": false
          }
        ]
    }
*/

/**
 * Update the User Profile
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.profileUpdate = async function(req, res) {

    let params = req.params
    let body = req.body

    try {

        let userProfileInfo = await domainRobot.user().profileInfo(params.user, params.context)

        let userProfile = userProfileInfo.result.data[0]

        if (body.profiles) {

            body.profiles.forEach(function(newElement) {

                let searchIndex = userProfile.profiles.findIndex(element => element.key === newElement.key)
    
                if (searchIndex > 0) {
                    userProfile.profiles[searchIndex] = newElement
                }
            })
        }

        let domainRobotResult = await domainRobot.user().profileUpdate(params.user, params.context, userProfile)
        res.send(domainRobotResult)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    User Service Profile Info Example Request

    GET /api/user/{username}/{context}/serviceProfile
*/


/**
 * Inquiring the User Service Profile
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.serviceProfileInfo = async function(req, res) {

    let params = req.params

    let prefix = ''
    if (params.prefix) {
        prefix = params.prefix
    }

    try {
        let domainRobotResult = await domainRobot.user().serviceProfileInfo(params.user, params.context, prefix)
        res.send(domainRobotResult)
    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

/*
    Update User Service Profile Example Request

    PUT /api/user/{username}/{context}/serviceProfile
    {
        {
	      "serviceProfiles": [
		    {
			  "key": "techc",
			  "value": "23242526"
		    }
	      ]
        }
    }
*/

/**
 * Update the User Service Profile
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {object} DomainRobotResult|DomainRobotException
 */
exports.serviceProfileUpdate = async function(req, res) {

    let params = req.params
    let body = req.body

    try {

        let userServiceProfileInfo = await domainRobot.user().serviceProfileInfo(params.user, params.context)

        let userServiceProfile = userServiceProfileInfo.result.data[0]

        if (body.servicePofiles) {

            body.servicePofiles.forEach(function(newElement) {

                let searchIndex = userServiceProfile.servicePofiles.findIndex(element => element.key === newElement.key)
    
                if (searchIndex > 0) {
                    userProfile.servicePofiles[searchIndex] = newElement
                }
            })
        }

        let domainRobotResult = await domainRobot.user().serviceProfileUpdate(params.user, params.context, userServiceProfile)
        res.send(domainRobotResult)

    } catch (DomainRobotException) {
        console.log(DomainRobotException)
        res.status(DomainRobotException.status).send(DomainRobotException)
    }
}

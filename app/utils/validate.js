'use strict'

let validationResult = require('express-validator').validationResult

/**
 * Validation Function for the Request 
 * Rules of the different Controllers
 * 
 * @param {*} req 
 * @param {*} res 
 * @return {function|string} 
 */
function validate(req, res, next) {

    let result = validationResult(req)

    if (result.isEmpty()) {
        return next()
    }

    let errors = []
    result.array().forEach(function(error) {
        errors.push({ [error.param]: error.msg })
    })

    return res.status(422).json({
        errors: errors
    })
}

module.exports = validate
'use strict'

let forge = require('node-forge')

/**
 * Generate a very basic Certificate Signing Request
 * 
 * @param {string} commonName 
 * @return {string} pem
 */
function generateCsr(commonName) {

    let keys = forge.pki.rsa.generateKeyPair({ bits: 2048 })

    let req = forge.pki.createCertificationRequest()

    req.publicKey = keys.publicKey

    req.setSubject([{ name: 'commonName', value: commonName }])

    req.sign(keys.privateKey)

    // convert certification request to PEM-format
    let pem = forge.pki.certificationRequestToPem(req)

    return pem
}

module.exports = generateCsr
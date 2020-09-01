'use strict'

let express = require('express')
let router = express.Router()

let validate = require('../utils/validate')

let contact = require('../controllers/contact')

router.post('/contact', contact.requestRules(), validate, contact.create)
router.get('/contact/:id([0-9]+)', contact.info)
router.put('/contact/:id([0-9]+)', contact.update)
router.delete('/contact/:id([0-9]+)', contact.delete)
router.post('/contact/_search', contact.list)

let domain = require('../controllers/domain')

router.post('/domain', domain.requestRules(), validate, domain.create)
router.get('/domain/:name', domain.requestRules(), validate, domain.info)
router.put('/domain/:name', domain.requestRules(), validate, domain.update)
router.post('/domain/_search', domain.list)
router.post('/domain/:name/_authinfo1', domain.requestRules(), validate, domain.createAuthinfo1)
router.delete('/domain/:name/_authinfo1', domain.requestRules(), validate, domain.deleteAuthinfo1)
router.post('/domain/:name/_authinfo2', domain.requestRules(), validate, domain.createAuthinfo2)
router.put('/domain/:name/_renew', domain.requestRules(), validate, domain.renew)
router.put('/domain/:name/_restore', domain.requestRules(), validate, domain.restore)
router.post('/domain/restore/_search', domain.restoreList)
router.post('/domain/_transfer', domain.requestRules(), validate, domain.transfer)

let user = require('../controllers/user')

router.get('/user/:username/:context', user.info)
router.post('/user/_search', user.list)

let sslContact = require('../controllers/sslContact')

router.post('/sslcontact', sslContact.requestRules(), validate, sslContact.create)
router.get('/sslcontact/:id([0-9]+)', sslContact.info)
router.put('/sslcontact/:id([0-9]+)', sslContact.update)
router.delete('/sslcontact/:id([0-9]+)', sslContact.delete)
router.post('/sslcontact/_search', sslContact.list)

let certificate = require('../controllers/certificate')

router.post('/certificate', certificate.createRequestRules(), validate, certificate.create)
router.post('/certificate/_realtime', certificate.createRequestRules(), validate, certificate.createRealtime)
router.post('/certificate/_prepareOrder', certificate.prepareRequestRules(), validate, certificate.prepareOrder)
router.get('/certificate/:id([0-9]+)', certificate.info)
router.delete('/certificate/:id([0-9]+)', certificate.delete)
router.post('/certificate/_search', certificate.list)

module.exports = router
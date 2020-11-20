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

let user2fa = require('../controllers/user2fa')

router.get('/OTPAuth', user2fa.tokenConfigInfo)
router.post('/OTPAuth', user2fa.tokenConfigCreate)
router.put('/user/_2fa', user2fa.tokenRules(), validate, user2fa.tokenConfigActivate)
router.delete('/user/_2fa', user2fa.tokenRules(), validate, user2fa.tokenConfigDelete)

let user = require('../controllers/user')

router.post('/user', user.createRequestRules(), validate, user.create)
router.put('/user/:user/:context/_lock', user.requestRules(), validate, user.updateLock)
router.put('/user/:user/:context/_unlock', user.requestRules(), validate, user.updateUnlock)
router.post('/user/:user/:context/copy', user.copyRequestRules(), validate, user.copy)
router.get('/user/:user/:context/profile/:prefix', user.requestRules(), validate, user.profileInfo)
router.get('/user/:user/:context/profile', user.requestRules(), validate, user.profileInfo)
router.put('/user/:user/:context/profile', user.requestRules(), validate, user.profileUpdate)
router.get('/user/:user/:context/serviceProfile/:prefix', user.requestRules(), validate, user.serviceProfileInfo)
router.get('/user/:user/:context/serviceProfile', user.requestRules(), validate, user.serviceProfileInfo)
router.put('/user/:user/:context/serviceProfile', user.requestRules(), validate, user.serviceProfileUpdate)
router.get('/user/:user/:context', user.requestRules(), validate, user.info)
router.put('/user/:user/:context', user.requestRules(), validate, user.update)
router.delete('/user/:user/:context', user.requestRules(), validate, user.delete)
router.post('/user/_search', user.list)
router.get('/user/billinglimit', user.billingObjectLimitInfo)
router.get('/user/billingterm', user.billingObjectTermsInfo)

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

let domainStudio = require('../controllers/domainstudio')

router.post('/domainstudio', domainStudio.search)

let whois = require('../controllers/whois')

router.get('/whois/:domain', whois.single)
router.post('/whois', whois.multi)

let domainBulk = require('../controllers/domainBulk')

router.patch('/bulk/domain', domainBulk.update)

module.exports = router
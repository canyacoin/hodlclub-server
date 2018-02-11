const sanitise = require('mongo-sanitize')
const Log = require('../services/Logger')
const ResponseHandler = require('./ResponseHandler')

const HodlApplication = require('./models/HodlApplication')

let self
function HodlerApi (db) {
  this.db = db
  self = this
}

/**
 *  Gets the n best hodlers, (length of time hodled, descending order)
 *  @param numberOfHodlers {Number} Number of records to return
 *  @param skip {Number} Number of records to skip
 *  @return {Array} Array of hodlers
 */
HodlerApi.prototype.bestHodlers = (req, res, data) => {
  if (!isNumber(data.numberOfHodlers)) return ResponseHandler.badRequest(res, ['numberOfHodlers should be numeric'])
  if (data.skip && !isNumber(data.skip)) return ResponseHandler.badRequest(res, ['skip should be numeric'])
  self.db.collection('longHodlers').createIndex({ becameHodlerAt: 1 })
  self.db.collection('longHodlers')
    .find({}, {
      limit: Number(sanitise(data.numberOfHodlers)),
      sort: [['becameHodlerAt', 1]],
      skip: (Number(sanitise(data.skip)) || 0)
    }).toArray((error, results) => {
      if (error) return ResponseHandler.serverError(res)
      if (results.length === 0) return ResponseHandler.success(res, [])
      ResponseHandler.success(res, results)
    })
}

/**
 *  Gets the n best hodler OGs, (length of time hodled, descending order)
 *  @param numberOfHodlers {Number} Number of records to return
 *  @return {Array} Array of hodlers
 */
HodlerApi.prototype.bestHodlerOGs = (req, res, data) => {
  if (!isNumber(data.numberOfHodlers)) return ResponseHandler.badRequest(res, ['numberOfHodlers should be numeric'])
  self.db.collection('longHodlers').createIndex({ becameHodlerAt: 1 })
  self.db.collection('longHodlers')
    .find({ isOG: true }, {
      limit: Number(sanitise(data.numberOfHodlers)),
      sort: [['becameHodlerAt', 1]]
    }).toArray((error, results) => {
      if (error) return ResponseHandler.serverError(res)
      if (results.length === 0) return ResponseHandler.success(res, [])
      ResponseHandler.success(res, results)
    })
}

/**
 *  Gets the details of any received airdrops for the hodler
 *  @param hodlerAddress {String} Address of the hodler to retrieve the airdrops for
 *  @return {Object} Details of any airdrops which have been given to this user
 */
HodlerApi.prototype.tokensAirdropped = (req, res, data) => {
  ResponseHandler.notFound(res)
}

/**
 *  Gets the detailed hodl stats for a particular address
 *  @param hodlerAddress {String} Address of the hodler
 *  @return {Object} Detailed hodl stats for the address in question
 */
HodlerApi.prototype.getHodlStats = async (req, res, data) => {
  if (!data.hodlerAddress) return ResponseHandler.badRequest(res, ['hodlerAddress should be a String'])
  let hodler
  let applicant
  try {
    hodler = await self.db.collection('hodlers').findOne({ ethAddress: sanitise(data.hodlerAddress).toLowerCase() })
    applicant = await self.db.collection('hodlerApplications').findOne({ 'ethAddress': sanitise(data.hodlerAddress).toLowerCase() })
  } catch (error) {
    Log.niceError(error)
    return ResponseHandler.serverError(res)
  }
  if (!hodler) return ResponseHandler.notFound(res)
  if (applicant) hodler.applied = true
  return ResponseHandler.success(res, hodler)
}

/**
 *  Submits an application to the hodl club
 *  @param discordHandle {String} Discord username for the hodler who is applying
 *  @param emailAddress {String} Email address for the applicant
 *  @param ethAddress {String} Ethereum address where the user has their tokens
 */
HodlerApi.prototype.submitApplication = async (req, res, data) => {
  let errors = []
  if (!isValidEmail(sanitise(data.emailAddress))) errors.push('Invalid email address')
  if (!isValidEthAddress(sanitise(data.ethAddress))) errors.push('Invalid Ethereum address')
  if (!isValidDiscordHandle(sanitise(data.discordHandle))) errors.push('Invalid Discord handle')
  if (errors.length > 0) return ResponseHandler.fail(res, errors)

  let isValidHodler
  try {
    isValidHodler = await HodlApplication.isValid(self.db, sanitise(data.ethAddress))
  } catch (error) {
    Log.niceError(error)
    return ResponseHandler.serverError(res)
  }
  if (!isValidHodler) return ResponseHandler.fail(res, ['Not enough CAN to join the club'])

  // TODO: check whether this eth address or discord handle is already in the database
  // if it is, chuck out an email to CanYa
  let alreadyApplied
  try {
    alreadyApplied = await HodlApplication.exists(self.db, { ethAddress: sanitise(data.ethAddress), discordHandle: sanitise(data.discordHandle), emailAddress: sanitise(data.emailAddress) })
  } catch (error) {
    Log.niceError(error)
    return ResponseHandler.serverError(res)
  }

  if (alreadyApplied) {
    return ResponseHandler.fail(res, ['Already applied to join the HODL Club'])
  }

  let canJoinInstantly
  try {
    canJoinInstantly = await HodlApplication.canJoinInstantly(self.db, { ethAddress: sanitise(data.ethAddress) })
  } catch (error) {
    Log.niceError(error)
    return ResponseHandler.serverError(res)
  }
  if (canJoinInstantly) {
    sendJoinNotificationEmail(data.emailAddress, data.ethAddress, data.discordHandle)
  }

  // input the application into the database
  try {
    await HodlApplication.insert(
      self.db,
      {
        ethAddress: sanitise(data.ethAddress),
        discordHandle: sanitise(data.discordHandle),
        emailAddress: sanitise(data.emailAddress)
      }
    )
  } catch (error) {
    Log.niceError(error)
    return ResponseHandler.serverError(res)
  }
  Log.info('New HODL Club application. ETH: ' + data.ethAddress + ', discord: ' + data.discordHandle + ', email: ' + data.emailAddress)
  ResponseHandler.success(res, { canJoinInstantly: canJoinInstantly })
}

/**
 *  Helper which tells you if something is a number (can still be typeof(string) though)
 *  @param n Variable to be tested
 *  @return {Boolean} Whether this thing can be parsed as a number
 */
function isNumber (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

/**
 *  Regexes the fuck out of a string to check whether it's an email address
 *  @param emailAddress {String} String to test against email address regexp
 *  @return {Boolean} Whether the thing passes the test or not
 */
function isValidEmail (emailAddress) {
  if (typeof emailAddress !== 'string') return false
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(emailAddress.toLowerCase())
}

/**
 *  Checks whether a string is in the format required for an Ethereum address. Requires '0x' prefix
 *  @param ethAddress {String} String to test for Ethereum address
 *  @return {Boolean} Whether the thing passes the check
 */
function isValidEthAddress (ethAddress) {
  if (typeof ethAddress !== 'string') return false
  let re = /^(0x)?([A-Fa-f0-9]{40})$/
  return re.test(ethAddress.toLowerCase()) && ethAddress.indexOf('0x') > -1
}

/**
 *  Basically just checks that the passed arg isn't undefined and is a string. Pretty useless really
 *  @param discordHandle {String} String we should check
 *  @return {Boolean} Whether it should be considered a valid discord handle
 */
function isValidDiscordHandle (discordHandle) {
  if (!discordHandle) return true
  if (typeof discordHandle !== 'string') return false
  return true
}

/**
 *  Sends a join notification email
 *  @param emailAddress {String} Email address to send to
 *  @param ethAddress {String} Ethereum address of the hodler
 *  @param discordHandle {String} Discord handle of the hodler
 */
function sendJoinNotificationEmail (emailAddress, ethAddress, discordHandle) {
  // @TODO
}

module.exports = HodlerApi

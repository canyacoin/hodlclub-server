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
      limit: Number(data.numberOfHodlers),
      sort: [['becameHodlerAt', 1]],
      skip: (Number(data.skip) || 0)
    }).toArray((error, results) => {
      if (error) return ResponseHandler.serverError(res)
      if (results.length === 0) return ResponseHandler.notFound(res)
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
      limit: Number(data.numberOfHodlers),
      sort: [['becameHodlerAt', 1]]
    }).toArray((error, results) => {
      if (error) return ResponseHandler.serverError(res)
      if (results.length === 0) return ResponseHandler.notFound(res)
      ResponseHandler.success(res, results)
    })
}

/**
 *  Gets the details of any received airdrops for the hodler
 *  @param hodlerAddress {String} Address of the hodler to retrieve the airdrops for
 *  @return {Object} Details of any airdrops which have been given to this user
 */
HodlerApi.prototype.tokensAirdropped = (req, res, data) => {
  console.log(data.hodlerAddress)
  ResponseHandler.notFound(res)
}

/**
 *  Gets the detailed hodl stats for a particular address
 *  @param hodlerAddress {String} Address of the hodler
 *  @return {Object} Detailed hodl stats for the address in question
 */
HodlerApi.prototype.getHodlStats = (req, res, data) => {
  if (!data.hodlerAddress) return ResponseHandler.badRequest(res, ['hodlerAddress should be a String'])
  self.db.collection('hodlers')
    .find({ address: data.hodlerAddress.toLowerCase() })
    .toArray((error, results) => {
      if (error) return ResponseHandler.serverError(res, error)
      if (results.length === 0) ResponseHandler.notFound(res)
      ResponseHandler.success(res, results)
    })
}

/**
 *  Submits an application to the hodl club
 *  @param telegramHandle {String} Telegram username for the hodler who is applying
 *  @param emailAddress {String} Email address for the applicant
 *  @param ethAddress {String} Ethereum address where the user has their tokens
 */
HodlerApi.prototype.submitApplication = async (req, res, data) => {
  let errors = []
  if (!isValidEmail(data.emailAddress)) errors.push('Invalid email address')
  if (!isValidEthAddress(data.ethAddress)) errors.push('Invalid Ethereum address')
  if (!isValidTelegramHandle(data.telegramHandle)) errors.push('Invalid Telegram handle')
  if (errors.length > 0) return ResponseHandler.badRequest(res, errors)
  let telegramHandle = formatTelegramHandle(data.telegramHandle)

  // TODO: check whether this eth address or telegram handle is already in the database
  // if it is, chuck out an email to CanYa
  let alreadyApplied
  try {
    alreadyApplied = await HodlApplication.exists(self.db, data.ethAddress, telegramHandle, data.emailAddress)
  } catch (error) {
    return ResponseHandler.serverError(res)
  }

  if (alreadyApplied) {
    return ResponseHandler.badRequest(res, ['Already applied to join the Hodl Club'])
  }
  // input the application into the database
  await HodlApplication.insert(
    self.db,
    {
      ethAddress: data.ethAddress,
      telegramHandle: telegramHandle,
      emailAddress: data.emailAddress
    }
  )
  Log.info('New Hodl Club application. ETH: ' + data.ethAddress + ', telegram: ' + telegramHandle + ', email: ' + data.emailAddress)
  ResponseHandler.ok(res)
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
 *  @param telegramHandle {String} String we should check
 *  @return {Boolean} Whether it should be considered a valid telegram handle
 */
function isValidTelegramHandle (telegramHandle) {
  if (!telegramHandle) return false
  if (typeof telegramHandle !== 'string') return false
  return true
}

/**
 *  Removes any '@' char from the front of a string
 *  @param telegramHandle {String} String to remove @ from
 *  @return {String} Formatted String
 */
function formatTelegramHandle (telegramHandle) {
  if (telegramHandle.indexOf('@') === 0) return telegramHandle.substr(1, telegramHandle.length)
  return telegramHandle
}

module.exports = HodlerApi

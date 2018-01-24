const Log = require('../services/Logger')

function HodlerApi () {
  // set up some stuff
}

/**
 *  Gets the n best hodlers, (length of time hodled, descending order)
 *  @param numberOfHodlers {Number} Number of records to return
 *  @return {Array} Array of hodlers
 */
HodlerApi.prototype.bestHodlers = (req, res, data) => {
  console.log(data.numberOfHodlers)
}

/**
 *  Gets the n best hodler OGs, (length of time hodled, descending order)
 *  @param numberOfHodlers {Number} Number of records to return
 *  @return {Array} Array of hodlers
 */
HodlerApi.prototype.bestHodlerOGs = (req, res, data) => {
  console.log(data.numberOfHodlers)
}

/**
 *  Gets the details of any received airdrops for the hodler
 *  @param hodlerAddress {String} Address of the hodler to retrieve the airdrops for
 *  @return {Object} Details of any airdrops which have been given to this user
 */
HodlerApi.prototype.tokensAirdropped = (req, res, data) => {
  console.log(data.hodlerAddress)
}

/**
 *  Gets the detailed hodl stats for a particular address
 *  @param hodlerAddress {String} Address of the hodler
 *  @return {Object} Detailed hodl stats for the address in question
 */
HodlerApi.prototype.getHodlStats = (req, res, data) => {
  console.log(data.hodlerAddress)
}

/**
 *  Submits an application to the hodl club
 *  @param telegramHandle {String} Telegram username for the hodler who is applying
 *  @param emailAddress {String} Email address for the applicant
 *  @param ethAddress {String} Ethereum address where the user has their tokens
 */
HodlerApi.prototype.submitApplication = (req, res, data) => {
  console.log(data.telegramHandle, data.emailAddress, data.ethAddress)
}

module.exports = HodlerApi

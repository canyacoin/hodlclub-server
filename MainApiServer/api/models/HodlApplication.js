const sanitise = require('mongo-sanitize')
const HODLER_TABLE = require('../../config/database').hodlerTable
const LONG_HODLER_TABLE = require('../../config/database').longHodlerTable
const APPLICATION_TABLE = require('../../config/database').applicationTable

let HodlApplication = {}

/**
 *  Tells us whether there is already an application with the specified data
 *  @param db {Object} Database connection object
 *  @param data {Object} Object containing the key value pairs we want to check for
 *  @return {Promise<Boolean>} Whether an application exists with these details already
 */
HodlApplication.exists = async (db, data) => {
  let { ethAddress, discordHandle, emailAddress } = data
  let queryObj = {}
  if (ethAddress) queryObj.ethAddress = sanitise(ethAddress)
  if (discordHandle) queryObj.discordHandle = sanitise(discordHandle)
  if (emailAddress) queryObj.emailAddress = sanitise(emailAddress)

  if (Object.keys(queryObj).length === 0) return false
  return new Promise((resolve, reject) => {
    db.collection(APPLICATION_TABLE).find({$or: [queryObj]}).toArray((error, results) => {
      if (error) return reject(Error(error))
      if (results.length === 0) return resolve(false)
      return resolve(true)
    })
  })
}

/**
 *  Checks whether an application is valid by checking for the user's presence in the hodler table
 *  @param db {Object} Database connection object
 *  @param ethAddress {String} Ethereum address
 *  @return {Promise<Boolean>} Resolved with whether the application is valid or not
 */
HodlApplication.isValid = async (db, ethAddress) => {
  return new Promise(async (resolve, reject) => {
    let hodler
    try {
      hodler = await db.collection(HODLER_TABLE).findOne({ethAddress: sanitise(ethAddress)})
    } catch (error) {
      return reject(Error(error))
    }
    if (hodler) return resolve(true)
    resolve(false)
  })
}

/**
 *  Checks a user's presence in the longHodler table
 *  @param db {Object} Database connection object
 *  @param ethAddress {String} Ethereum address
 *  @return {Promise<Boolean>} Resolved with whether the user is a longHodler or not
 */
HodlApplication.canJoinInstantly = async (db, ethAddress) => {
  return new Promise(async (resolve, reject) => {
    let longHodler
    try {
      longHodler = await db.collection(LONG_HODLER_TABLE).findOne({ethAddress: sanitise(ethAddress)})
    } catch (error) {
      return reject(Error(error))
    }
    if (longHodler) return resolve(true)
    resolve(false)
  })
}

/**
 *  Inserts a new application into the database
 *  @param db {Object} Database connection object
 *  @param data {Object} Application object to insert into the database
 *  @return {Promise<Void>} Resolves when the query is complete
 */
HodlApplication.insert = async (db, data) => {
  return new Promise(async (resolve, reject) => {
    if (!data.ethAddress || !data.discordHandle || !data.emailAddress) return reject(new Error('Could not save, missing information'))
    try {
      await db.collection(APPLICATION_TABLE).insertOne({
        ethAddress: sanitise(data.ethAddress).toLowerCase(),
        discordHandle: sanitise(data.discordHandle).toLowerCase(),
        emailAddress: sanitise(data.emailAddress).toLowerCase()
      })
    } catch (error) {
      return reject(Error(error))
    }
    resolve()
  })
}

/**
 *  Removes an application from the database
 *  @param db {Object} Database connection object
 *  @param data {Object} Application object to remove from the database
 *  @return {Promise<Void>} Resolves when the deletion is complete
 */
HodlApplication.remove = async (db, data) => {
  return new Promise(async (resolve, reject) => {
    if (!data.ethAddress || !data.discordHandle || !data.emailAddress) return reject(new Error('Could not remove, missing information'))
    try {
      await db.collection(APPLICATION_TABLE).findOneAndDelete({
        ethAddress: sanitise(data.ethAddress).toLowerCase(),
        discordHandle: sanitise(data.discordHandle).toLowerCase(),
        emailAddress: sanitise(data.emailAddress).toLowerCase()
      })
    } catch (error) {
      return reject(Error(error))
    }
    resolve()
  })
}

module.exports = HodlApplication

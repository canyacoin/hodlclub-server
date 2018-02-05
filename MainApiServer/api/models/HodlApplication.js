const sanitise = require('mongo-sanitize')
const HODLER_TABLE = require('../../config/database').hodlerTable
const APPLICATION_TABLE = require('../../config/database').applicationTable

let HodlApplication = {}

/**
 *  Tells us whether there is already an application with the specified data
 *  @param db {Object} Database connection object
 *  @param data {Object} Object containing the key value pairs we want to check for
 *  @return {Promise<Boolean>} Whether an application exists with these details already
 */
HodlApplication.exists = async (db, data) => {
  let { ethAddress, telegramHandle, emailAddress } = data
  let queryObj = {}
  if (ethAddress) queryObj.ethAddress = sanitise(ethAddress)
  if (telegramHandle) queryObj.telegramHandle = sanitise(telegramHandle)
  if (emailAddress) queryObj.emailAddress = sanitise(emailAddress)

  if (Object.keys(queryObj).length === 0) return false
  return new Promise((resolve, reject) => {
    db.collection(APPLICATION_TABLE).find(queryObj).toArray((error, results) => {
      if (error) return reject(new Error('Query error'))
      if (results.length === 0) return resolve(false)
      return resolve(true)
    })
  })
}

HodlApplication.isValid = async (db, ethAddress) => {
  return new Promise(async (resolve) => {
    let hodler = await db.collection(HODLER_TABLE).findOne({ethAddress: sanitise(ethAddress)})
    if (hodler) {
      resolve(true)
    } else {
      resolve(false)
    }
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
    if (!data.ethAddress || !data.telegramHandle || !data.emailAddress) return reject(new Error('Could not save, missing information'))
    await db.collection(APPLICATION_TABLE).insertOne({
      ethAddress: sanitise(data.ethAddress).toLowerCase(),
      telegramHandle: sanitise(data.telegramHandle).toLowerCase(),
      emailAddress: sanitise(data.emailAddress).toLowerCase()
    })
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
    if (!data.ethAddress || !data.telegramHandle || !data.emailAddress) return reject(new Error('Could not remove, missing information'))
    await db.collection(APPLICATION_TABLE).findOneAndDelete({
      ethAddress: sanitise(data.ethAddress).toLowerCase(),
      telegramHandle: sanitise(data.telegramHandle).toLowerCase(),
      emailAddress: sanitise(data.emailAddress).toLowerCase()
    })
    resolve()
  })
}

module.exports = HodlApplication

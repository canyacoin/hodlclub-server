const sanitise = require('mongo-sanitize')
const Log = require('./services/Logger')
const { applicationTable, hodlerTable, longHodlerTable, blacklistTable } = require('../config/database')
const CsvService = require('./services/CsvService')
const Api = {}

/**
 *  Sets the DB object that we should be using to access the hodl club
 *  @param db {Object} Mongo database object
 */
Api.setDb = (db) => {
  Api.db = db
  Api.db.collection(applicationTable).createIndex({ '$**': 'text' })
  Api.db.collection(hodlerTable).createIndex({ '$**': 'text' })
}

/**
 *  Searches the database for a particular user; all params are req.body params
 *  @param telegram {String} Telegram handle to search for
 *  @param email {String} Email address to search for
 *  @param ethAddress {String} Ethereum address to search for
 *  @return {Object} JSON object with applications & hodlers
 */
Api.search = async (req, res, next) => {
  let { telegram, email, ethAddress } = req.body
  let queryString = telegram + ' ' + email + ' ' + ethAddress
  Api.db.collection(applicationTable).find({ $text: { $search: sanitise(queryString) } }).toArray((e, results) => {
    let applicationResults = results
    let applicationAddresses = []
    if (ethAddress) applicationAddresses.push(ethAddress)
    for (let application of applicationResults) {
      applicationAddresses.push(application.ethAddress)
    }
    Api.db.collection(hodlerTable).find({ethAddress: { $in: applicationAddresses }}).toArray((e, results) => {
      let hodlerResults = results
      res.json({
        applications: applicationResults,
        hodlers: hodlerResults
      })
    })
  })
}

/**
 *  Toggles the blacklist status for a particular Ethereum address, this address will no longer be
 *  included in the list of hodlers on the customer-facing site; all params are req.body params
 *  @param ethAddress {String} Ethereum address to blacklist
 *  @return {Object} JSON object detailing whether the operation was successful
 */
Api.blacklist = async (req, res, next) => {
  let { ethAddress } = req.body
  if (!ethAddress) return res.status(403).json({success: false, error: 'Please specify an ETH address'})
  const lowerCaseAddress = ethAddress.toLowerCase()
  try {
    let hodler = await Api.db.collection(hodlerTable).findOne({ ethAddress: lowerCaseAddress })
    let setBlacklistStatus = !hodler.blacklisted
    if (setBlacklistStatus) {
      await Api.db.collection(blacklistTable).updateOne({
        address: lowerCaseAddress
      }, { $set: { address: lowerCaseAddress } }, { upsert: true })
    } else {
      await Api.db.collection(blacklistTable).removeOne({ address: lowerCaseAddress })
    }
    await Api.db.collection(hodlerTable).updateOne({
      ethAddress: lowerCaseAddress
    }, { $set: { blacklisted: setBlacklistStatus } })
    res.json({ success: true })
  } catch (error) {
    Log.niceError(error)
    res.json({ success: false })
  }
}

/**
 *  Toggles the OG status for the user; all params are req.body properties
 *  @param ethAddress {String} Ethereum address to toggle the OG status of
 *  @return {Object} JSON object with whether the operation was successful or not
 */
Api.makeOG = async (req, res, next) => {
  let { ethAddress } = req.body
  if (!ethAddress) return res.status(403).json({success: false, error: 'Please specify an ETH address'})
  const lowerCaseAddress = ethAddress.toLowerCase()
  try {
    let hodler = await Api.db.collection(hodlerTable).findOne({ ethAddress: lowerCaseAddress })
    let setOGStatus = !hodler.isOG
    await Api.db.collection(longHodlerTable).updateOne(
      { ethAddress: lowerCaseAddress },
      { $set: {
        ethAddress: lowerCaseAddress,
        balance: hodler.balance,
        isOG: setOGStatus,
        becameHodlerAt: hodler.becameHodlerAt
      } },
      { upsert: true }
    )
    await Api.db.collection(hodlerTable).updateOne(
      { ethAddress: lowerCaseAddress },
      { $set: { isOG: setOGStatus } },
      { upsert: true }
    )
    res.json({ success: true })
  } catch (error) {
    Log.niceError(error)
    res.json({ success: false })
  }
}

/**
 *  Exports everyone from the hodlers table as a CSV
 */
Api.exportAllHodlers = async (req, res, next) => {
  const cursor = Api.db.collection(hodlerTable).find({})
  const transform = (doc) => {
    return {
      EthAddress: doc.ethAddress,
      CANBalance: doc.balance,
      BecameHodlerAt: doc.becameHodlerAt,
      OG: doc.isOG,
      blacklisted: doc.blacklisted ? doc.blacklisted : false
    }
  }
  const filename = 'Hodlers-Export-' + new Date()
  CsvService.download(cursor, transform, filename, res)
}

/**
 *  Exports everyone from the longHodlers table as a CSV
 */
Api.exportAllMembers = async (req, res, next) => {
  const cursor = Api.db.collection(longHodlerTable).find({})
  const transform = (doc) => {
    return {
      EthAddress: doc.ethAddress,
      CANBalance: doc.balance,
      BecameHodlerAt: doc.becameHodlerAt,
      OG: doc.isOG
    }
  }
  const filename = 'HodlClubMembers-Export-' + new Date()
  CsvService.download(cursor, transform, filename, res)
}

/**
 *  Exports everyone from the applications table, joined with the hodlers table
 */
Api.exportAllApplications = async (req, res, next) => {
  const cursor = Api.db.collection(applicationTable).aggregate([{ $lookup: {
    from: hodlerTable,
    localField: 'ethAddress',
    foreignField: 'ethAddress',
    as: 'mergeApplications'
  }}, {
    $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: ['$mergeApplications', 0] }, '$$ROOT' ] } }
  }, {
    $project: { mergeApplications: 0 }
  }])
  const transform = (doc) => {
    return {
      EthAddress: doc.ethAddress,
      CANBalance: doc.balance,
      BecameHodlerAt: doc.becameHodlerAt,
      OG: doc.isOG,
      blacklisted: doc.blacklisted ? doc.blacklisted : false,
      telegramHandle: doc.telegramHandle,
      emailAddress: doc.emailAddress
    }
  }
  const filename = 'HodlClubApplications-Export-' + new Date()
  CsvService.download(cursor, transform, filename, res)
}

module.exports = Api

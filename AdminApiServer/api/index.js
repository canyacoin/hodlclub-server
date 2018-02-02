const { applicationTable, hodlerTable, longHodlerTable, blacklistTable } = require('../config/database')
const CsvService = require('./CsvService')
const Api = {}

Api.setDb = (db) => {
  Api.db = db
  Api.db.collection(applicationTable).createIndex({ '$**': 'text' })
  Api.db.collection(hodlerTable).createIndex({ '$**': 'text' })
}

Api.search = async (req, res, next) => {
  let { telegram, email, ethAddress } = req.body
  let queryString = telegram + ' ' + email + ' ' + ethAddress

  Api.db.collection(applicationTable).find({ $text: { $search: queryString }}).toArray((e, results) => {
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

Api.blacklist = async (req, res, next) => {
  let { ethAddress } = req.body
  if (!ethAddress) return res.send(403)
  let hodler = await Api.db.collection(hodlerTable).findOne({ ethAddress: ethAddress })
  let setBlacklistStatus = !hodler.blacklisted
  if (setBlacklistStatus) {
    await Api.db.collection(blacklistTable).updateOne({
      address: ethAddress.toLowerCase()
    }, { $set: { address: ethAddress } }, { upsert: true })
  } else {
    await Api.db.collection(blacklistTable).removeOne({ address: ethAddress.toLowerCase() })
  }
  await Api.db.collection(hodlerTable).updateOne({
    ethAddress: ethAddress.toLowerCase()
  }, { $set: { blacklisted: setBlacklistStatus }})
  res.json({ success: true })
}

Api.makeOG = async (req, res, next) => {
  let { ethAddress } = req.body
  let hodler = await Api.db.collection(hodlerTable).findOne({ ethAddress: ethAddress })
  let setOGStatus = !hodler.isOG
  await Api.db.collection(longHodlerTable).updateOne(
    { ethAddress: ethAddress },
    { $set: {
      ethAddress: ethAddress,
      balance: hodler.balance,
      isOG: setOGStatus,
      becameHodlerAt: hodler.becameHodlerAt
    } },
    { upsert: true }
  )
  await Api.db.collection(hodlerTable).updateOne(
    { ethAddress: ethAddress },
    { $set: { isOG: setOGStatus } },
    { upsert: true }
  )
  res.json({ success: true })
}

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

Api.exportAllApplications = async (req, res, next) => {
  const cursor = Api.db.collection(applicationTable).aggregate([{ $lookup: { 
    from: hodlerTable,
    localField: 'ethAddress',
    foreignField: 'ethAddress',
    as: 'mergeApplications'
  }}, { 
    $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: ['$mergeApplications', 0] }, "$$ROOT" ] } }
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
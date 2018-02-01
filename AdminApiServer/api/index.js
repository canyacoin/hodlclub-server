const { applicationTable, hodlerTable, longHodlerTable } = require('../config/database')
const Api = {}

Api.setDb = (db) => {
  Api.db = db
  Api.db.collection(applicationTable).createIndex({ '$**': 'text' })
}

Api.search = async (req, res, next) => {
  let { telegram, email, ethAddress } = req.body
  let queryString = telegram + ' ' + email + ' ' + ethAddress
  Api.db.collection(applicationTable).find({ $text: { $search: queryString }}).toArray((e, results) => {
    let applicationResults = results
    let applicationAddresses = []
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
  await Api.db.collection(blacklistTable).updateOne({
    address: ethAddress.toLowerCase()
  }, {
    $set: {
      address: ethAddress
    }
  }, {
    upsert: true
  })
}

Api.makeOG = async (req, res, next) => {
  let { ethAddress } = req.body
  Api.db.collection(hodlerTable).find({ ethAddress: ethAddress }).toArray(async (e, res) => {
    let hodler = res[0]
    await Api.db.collection(longHodlerTable).updateOne(
      { address: ethAddress },
      { $set: {
        address: ethAddress,
        balance: hodler.balance,
        isOG: true,
        becameHodlerAt: hodler.becameHodlerAt
      } },
      { upsert: true }
    )
    await Api.db.collection(hodlerTable).updateOne(
      { address: ethAddress },
      { $set: { isOG: true } },
      { upsert: true }
    )

    res.status(200).send()
  })
}

module.exports = Api
const MongoClient = require('mongodb').MongoClient
const dbConfig = require('../config/database')
const HODLER_TABLE = dbConfig.hodlerTable
const LONG_HODLER_TABLE = dbConfig.longHodlerTable
const HODL_CLUB_APPLICATION_TABLE = dbConfig.applicationTable

const OGHolders = require('./OGList')

let db
async function main () {
  db = await connectToDb()

  for (let address in OGHolders) {
    address = address.toLowerCase()
    let hodler = await addressIsHodler(address)
    if (hodler) {
      let emailAddress = OGHolders[address] ? OGHolders[address].toLowerCase() : ''
      await makeOG(address, hodler)
      console.log('Inserting ' + emailAddress + ', ' + address)
      await insertApplication(address, emailAddress)
    }
  }
  process.exit(0)
}

async function connectToDb () {
  return new Promise((resolve) => {
    MongoClient.connect(dbConfig.url, (err, client) => {
      if (err) throw new Error(err)
      console.log('Connected to database at ' + dbConfig.url)
      const db = client.db(dbConfig.dbName)
      resolve(db)
    })
  })
}

async function addressIsHodler (address) {
  return new Promise(async (resolve) => {
    let hodler = await db.collection(HODLER_TABLE).findOne({ ethAddress: address })
    resolve(hodler)
  })
}

async function makeOG (address, hodler) {
  return new Promise(async (resolve) => {
    let OGStatus = hodler.balance >= 5000000000
    if (!OGStatus) return resolve()
    await db.collection(HODLER_TABLE).updateOne({ ethAddress: address }, { $set: { isOG: OGStatus } })
    await db.collection(LONG_HODLER_TABLE).updateOne({ ethAddress: address }, { $set: {
      ethAddress: hodler.ethAddress,
      isOG: OGStatus,
      becameHodlerAt: hodler.becameHodlerAt,
      balance: hodler.balance
    } }, { upsert: true })
    resolve()
  })
}

async function insertApplication (address, email) {
  return new Promise(async (resolve) => {
    await db.collection(HODL_CLUB_APPLICATION_TABLE).updateOne({ ethAddress: address }, { $set: { ethAddress: address, emailAddress: email } }, { upsert: true })
    resolve()
  })
}

main()

/**
 *  The purpose of this script is to get all of the addresses which hold CAN, and have held CAN for
 *  45 days or more. These addresses are then inserted into the database.
 *
 *  Usage:
 *    node getHodlers.js [--hodlDays {Number}] (-e)
 *
 *  Options (alias):
 *    --hodlDays (-d)
 *      The amount of days a user should be hodling for to be considered part of the club. Users in
 *      the club who no longer meet this requirement will be kicked out (removed from the database).
 *
 *    --sendEmails (-e) @TODO(tom)
 *      Whether the script should send emails or not. If this flag is omitted, details of the emails
 *      which would have been sent are added to the log file.
 *
 */

const Email = require('../services/Email')
const MongoClient = require('mongodb').MongoClient
const dbConfig = require('../config/database')
const HODLER_TABLE = dbConfig.hodlerTable
const LONG_HODLER_TABLE = dbConfig.longHodlerTable
const HODL_CLUB_APPLICATION_TABLE = dbConfig.applicationTable
const BLACKLIST_TABLE = dbConfig.blacklistTable

const BigNumber = require('bignumber.js')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.IpcProvider(process.env.PARITY_IPC_PATH, require('net')))
const HodlClubTokenThreshold = new BigNumber(2500000000)

const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'hodlDays', alias: 'd', type: Number },
  { name: 'sendEmails', alias: 'e', type: Boolean }
]
const OPTIONS = commandLineArgs(optionDefinitions)

if (!OPTIONS.hodlDays) throw new Error('Please specify the number of days required to be a hodler with --hodlDays')
if (OPTIONS.sendEmails) {
  // TODO: fill out this address
  console.log('Emails are set to ON, this script will attempt to send from the address: ')
} else {
  console.log('Emails are set to OFF.')
}

const CAN_DEPLOYMENT_BLOCK = 4332959
const SECONDS_IN_DAY = 86400
const TOKEN_TRANSFER_EVENT_HASH = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

const tokenMeta = require('./res/token')

async function main () {
  let db = await connectToDb()
  let blacklist = await getBlacklistedAddresses(db)
  let blockNumber = await getCurrentBlockNumber()
  let tokenTransferEvents = await getAllTokenTransferEvents(blockNumber)
  let { hodlers, unfaithful } = await processEvents(tokenTransferEvents, blacklist)
  let newLongHodlers = await processHodlers(hodlers, blockNumber, blacklist, db)
  await processUnfaithful(unfaithful, db)
  await notifyNewLongHolders(newLongHodlers, db)
  process.exit(1)
}

/**
 *  Gets all of the token transfer events from our node
 *  @param upToBlock {Number} Block number up to which to get events
 *  @return {Promise} Resolves to the array of transfer events
 */
async function getAllTokenTransferEvents (upToBlock) {
  let tokenContract = web3.eth.contract(tokenMeta.abi).at(tokenMeta.address)
  return new Promise((resolve) => {
    tokenContract.allEvents({
      fromBlock: CAN_DEPLOYMENT_BLOCK,
      toBlock: upToBlock,
      topics: [TOKEN_TRANSFER_EVENT_HASH]
    }).get((e, events) => {
      resolve(events)
    })
  })
}

/**
 *  Should probably split this into multiple functions. Essentially it runs through the transfer
 *  events and removes from the club anyone who has sent any CAN. Then it looks at the receiver of
 *  the xfer, and provisionally adds them to the club. As long as they send no txs after this, they
 *  will remain in the club. Adds the timestamp at which they exceeded the 2.5k CAN threshold.
 *  @param events {Array} Array of web3 transfer events
 *  @return {Object} Object of hodl club members, keyed by the address of the member
 */
async function processEvents (events, blacklist) {
  let receivers = {}
  let receiver = {}
  let kickedOut = {}
  let timestamp = 0
  for (let event of events) {
    if (event.type !== 'mined') continue
    if (event.event !== 'Transfer') continue
    receiver = {}
    timestamp = 0
    let sendingAddress = event.args.from.toLowerCase()
    let receivingAddress = event.args.to.toLowerCase()
    if (receivers[sendingAddress]) {
      // kick this user out of the club
      kickedOut[sendingAddress] = true
      delete receivers[sendingAddress]
    }
    if (blacklist.indexOf(receivingAddress) !== -1) {
      kickedOut[receivingAddress] = true
      continue
    }
    if (!receivers[receivingAddress]) {
      // we don't have this user yet
      if (event.args.value.gte(HodlClubTokenThreshold)) {
        // this person has enough to be in the hodl club at this point!!!
        timestamp = await getBlockTimestamp(event.blockNumber)
        receiver.timestampOverThreshold = timestamp
      }
      receiver.balance = event.args.value
      receivers[receivingAddress] = receiver
      delete kickedOut[receivingAddress]
    } else {
      receiver = receivers[receivingAddress]
      receiver.balance = receiver.balance.add(event.args.value)
      if (!receiver.timestampOverThreshold && receiver.balance.gte(HodlClubTokenThreshold)) {
        timestamp = await getBlockTimestamp(event.blockNumber)
        receiver.timestampOverThreshold = timestamp
      }
      receivers[receivingAddress] = receiver
      delete kickedOut[receivingAddress]
    }
  }
  return { hodlers: receivers, unfaithful: kickedOut }
}

/**
 *  Runs through all the hodlers and adds them to the DB if they have been hodling for the correct
 *  number of days.
 *  @param hodlers {Object} Hodler object keyed by address
 *  @param currentBlockNumber {Number} Block number that we got events up to, to calculate hodl time
 *  @param blacklist {Array} Blacklisted addresses
 *  @param db {Object} Database connection, so we can store each hodler in the DB
 */
async function processHodlers (hodlers, currentBlockNumber, blacklist, db) {
  return new Promise(async (resolve) => {
    let currentBlockTimestamp = new BigNumber(await getBlockTimestamp(currentBlockNumber))
    let newLongHodlers = []
    let hodlerObj = {}
    let count = 0
    for (let hodlerAddress in hodlers) {
      if (blacklist.indexOf(hodlerAddress) !== -1) continue
      let hodler = hodlers[hodlerAddress]
      if (!hodler.timestampOverThreshold) continue
      let becameHodler = new BigNumber(hodler.timestampOverThreshold)
      let daysSinceBecameHolder = getDaysBetween(currentBlockTimestamp, becameHodler)
      hodlerObj = {
        ethAddress: hodlerAddress.toLowerCase(),
        balance: hodler.balance.toNumber(),
        isOG: false,
        becameHodlerAt: hodler.timestampOverThreshold
      }
      if (daysSinceBecameHolder >= OPTIONS.hodlDays) {
        // now put it in the db
        let newLongHodler = await insertIntoDb(LONG_HODLER_TABLE, hodlerObj, db)
        if (newLongHodler) newLongHodlers.push(hodlerObj)
      }
      await insertIntoDb(HODLER_TABLE, hodlerObj, db)
      count++
    }
    console.log('Processed ' + count + ' hodlers')
    resolve(newLongHodlers)
  })
}

/**
 *  Ensures that nobody who has moved their tokens in the last --hodlDays days is in the database
 *  @param unfaithful {Object} Users who have moved tokens, keyed by address
 *  @param db {Object} Database connection object
 *  @return {Promise} Resolves when the query is complete
 */
async function processUnfaithful (unfaithful, db) {
  // get whether we're in the hodl club
  // if we are, delete us from the club
  return new Promise(async (resolve) => {
    let unfaithfulAddresses = Object.keys(unfaithful)
    try {
      await db.collection(LONG_HODLER_TABLE).deleteMany({ ethAddress: { $in: unfaithfulAddresses } })
      await db.collection(HODLER_TABLE).deleteMany({ ethAddress: { $in: unfaithfulAddresses } })
    } catch (e) {
      throw new Error(e)
    }
    resolve()
  })
}

/**
 *  Gets the email addresses of the new hodl club members (if they have applied) then sends them an
 *  email to congratulate them on being part of the hodl club.
 *  @param newLongHodlers {Array} Array of the new hodlers
 *  @param db {Object} Database connection object
 *  @return {Promise<Void>} Resolves when email operations are complete
 */
async function notifyNewLongHolders (newLongHodlers, db) {
  return new Promise(async (resolve, reject) => {
    let newHolderAddresses = newLongHodlers.map((hodler) => hodler.ethAddress.toLowerCase())
    console.log(newHolderAddresses)
    db.collection(HODL_CLUB_APPLICATION_TABLE)
      .find({ ethAddress: { $in: newHolderAddresses } })
      .toArray((e, newHodlMembers) => {
        // @TODO these are the new HODL members, we need to send them an email (or maybe a telegram in the future!)
        if (e) return reject(new Error(e))
        if (!newHodlMembers || newHodlMembers.length === 0) return resolve()
        for (let newHodler of newHodlMembers) {
          // @TODO notify each user
          // @TODO ask Alex to design hodl club acceptance email
          // console.log(newHodler)
          // Email.send(newHodler.emailAddress)
        }
        resolve()
      })
  })
}

/**
 *  Gets the number of days between a pair of BigNumbers
 *  @param presentTimestamp {BigNumber} The more recent of the two timestamps
 *  @param pastTimestamp {BigNumber} The older of the two timestamps
 *  @return {Number} Number of whole days that the user has been a hodler
 */
function getDaysBetween (presentTimestamp, pastTimestamp) {
  let secondsBetween = presentTimestamp.sub(pastTimestamp)
  let days = Math.floor(secondsBetween.div(SECONDS_IN_DAY).toNumber())
  return days
}

/**
 *  Gets the timestamp of a given block number
 *  @param blockNumber {Number} Number of the block to retrieve the timestamp of
 *  @return {Promise} Resolves to the timestamp of the block
 */
function getBlockTimestamp (blockNumber) {
  return new Promise((resolve) => {
    web3.eth.getBlock(blockNumber, (e, blockDetails) => resolve(blockDetails.timestamp))
  })
}

/**
 *  Gets the latest block number which has been synced by the node we're connected to
 *  @return {Promise} Resolves to the latest block number
 */
function getCurrentBlockNumber () {
  return new Promise((resolve) => {
    web3.eth.getBlockNumber((e, number) => resolve(number))
  })
}

/**
 *  Inserts the hodler into the database
 *  @param hodlerObj {Object} Hodler object to insert into the database
 *  @return {Promise<Boolean>} Resolves with whether the operation created a new doc
 */
function insertIntoDb (table, hodlerObj, db) {
  return new Promise(async (resolve) => {
    let doc
    try {
      doc = await db.collection(table).updateOne(
        { ethAddress: hodlerObj.ethAddress },
        { $set: hodlerObj },
        { upsert: true })
    } catch (e) {
      throw new Error(e)
    }
    resolve(doc.upsertedCount > 0)
  })
}

function getBlacklistedAddresses (db) {
  return new Promise(async (resolve) => {
    db.collection(BLACKLIST_TABLE).find({}).toArray((e, res) => {
      resolve(res.map((el) => el.address.toLowerCase()))
    })
  })
}

/**
 *  Connects to the mongo database and returns the connection object
 *  @return {Promise} Resolves to the connection object
 */
function connectToDb () {
  return new Promise((resolve) => {
    MongoClient.connect(dbConfig.url, (err, client) => {
      if (err) throw new Error(err)
      console.log('Connected to database at ' + dbConfig.url)
      const db = client.db(dbConfig.dbName)
      resolve(db)
    })
  })
}

main()

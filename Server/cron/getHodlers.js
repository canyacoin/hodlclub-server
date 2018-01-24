/**
 *  The purpose of this script is to get all of the addresses which hold CAN, and have held CAN for
 *  45 days or more. These addresses are then inserted into the database.
 *
 *  Note that in it's current form, users are never removed from the database.
 *
 *  Usage:
 *    node getHodlers.js [-d]
 *
 *  Options (alias):
 *    --hodlDays (-d)
 *      The amount of days a user should be hodling for to be considered part of the club. Users in
 *      the club who no longer meet this requirement will be kicked out (removed from the database).
 *
 */

const MongoClient = require('mongodb').MongoClient
const dbConfig = require('../config/database')

const BigNumber = require('bignumber.js')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.IpcProvider(process.env.PARITY_IPC_PATH, require('net')))
const HodlClubTokenThreshold = new BigNumber(2500000000)

const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'hodlDays', alias: 'd', type: Number }
]
const OPTIONS = commandLineArgs(optionDefinitions)

if (!OPTIONS.hodlDays) throw new Error('Please specify the number of days required to be a hodler with --hodlDays')

const CAN_DEPLOYMENT_BLOCK = 4332959
const SECONDS_IN_DAY = 86400
const TOKEN_TRANSFER_EVENT_HASH = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

const tokenMeta = require('./res/token')

async function main () {
  let db = await connectToDb()
  let blockNumber = await getCurrentBlockNumber()
  let tokenTransferEvents = await getAllTokenTransferEvents(blockNumber)
  let { hodlers, unfaithful } = await processEvents(tokenTransferEvents)
  await processHodlers(hodlers, blockNumber, db)
  await processUnfaithful(unfaithful, db)
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
async function processEvents (events) {
  let receivers = {}
  let receiver = {}
  let kickedOut = {}
  let timestamp = 0
  for (let event of events) {
    if (event.type !== 'mined') continue
    if (event.event !== 'Transfer') continue
    receiver = {}
    timestamp = 0
    if (receivers[event.args.from]) {
      // kick this user out of the club
      kickedOut[event.args.from] = true
      delete receivers[event.args.from]
    }
    if (!receivers[event.args.to]) {
      // we don't have this user yet
      if (event.args.value.gte(HodlClubTokenThreshold)) {
        // this person has enough to be in the hodl club at this point!!!
        timestamp = await getBlockTimestamp(event.blockNumber)
        receiver.timestampOverThreshold = timestamp
      }
      receiver.balance = event.args.value
      receivers[event.args.to] = receiver
      delete kickedOut[event.args.to]
    } else {
      receiver = receivers[event.args.to]
      receiver.balance = receiver.balance.add(event.args.value)
      if (!receiver.timestampOverThreshold && receiver.balance.gte(HodlClubTokenThreshold)) {
        timestamp = await getBlockTimestamp(event.blockNumber)
        receiver.timestampOverThreshold = timestamp
      }
      receivers[event.args.to] = receiver
      delete kickedOut[event.args.to]
    }
  }
  return { hodlers: receivers, unfaithful: kickedOut }
}

/**
 *  Runs through all the hodlers and adds them to the DB if they have been hodling for the correct
 *  number of days.
 *  @param hodlers {Object} Hodler object keyed by address
 *  @param currentBlockNumber {Number} Block number that we got events up to, to calculate hodl time
 *  @param db {Object} Database connection, so we can store each hodler in the DB
 */
async function processHodlers (hodlers, currentBlockNumber, db) {
  let currentBlockTimestamp = new BigNumber(await getBlockTimestamp(currentBlockNumber))
  let hodler
  let becameHodler
  let hodlerObj = {}
  let count = 0
  for (let hodlerAddress in hodlers) {
    hodler = hodlers[hodlerAddress]
    if (!hodler.timestampOverThreshold) continue
    becameHodler = new BigNumber(hodler.timestampOverThreshold)
    let daysSinceBecameHolder = getDaysBetween(currentBlockTimestamp, becameHodler)
    if (daysSinceBecameHolder >= OPTIONS.hodlDays) {
      count++
      // now put it in the db
      hodlerObj = {
        address: hodlerAddress.toLowerCase(),
        balance: hodler.balance.toNumber(),
        isOG: false,
        becameHodlerAt: hodler.timestampOverThreshold
      }
      await insertIntoDb(hodlerObj, db)
    }
  }
  console.log('Added ' + count + ' to the database')
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
      await db.deleteMany({ address: { $in: unfaithfulAddresses } })
    } catch (e) {
      throw new Error(e)
    }
    resolve()
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
 *  @return {Promise} Resolves when the insert is complete
 */
function insertIntoDb (hodlerObj, db) {
  return new Promise(async (resolve) => {
    try {
      await db.updateOne(
        { address: hodlerObj.address },
        { $set: {
          address: hodlerObj.address,
          balance: hodlerObj.balance,
          isOG: hodlerObj.isOG,
          becameHodlerAt: hodlerObj.becameHodlerAt
        }},
        { upsert: true })
    } catch (e) {
      throw new Error(e)
    }
    resolve()
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
      resolve(db.collection('hodlers'))
    })
  })
}

main()

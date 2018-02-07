const BigNumber = require('bignumber.js')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.IpcProvider(process.env.PARITY_IPC_PATH, require('net')))
const HodlClubTokenThreshold = new BigNumber(2500000000)

const CAN_DEPLOYMENT_BLOCK = 4332959
const SECONDS_IN_DAY = 86400
const TOKEN_TRANSFER_EVENT_HASH = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

const whitelist = require('./res/ogaddresses')
for (let i = 0; i < whitelist.length; i++) {
  whitelist[i] = whitelist[i].toLowerCase()
}

const tokenMeta = require('./res/token')

async function main () {
  let blockNumber = await getCurrentBlockNumber()
  let tokenTransferEvents = await getAllTokenTransferEvents(blockNumber)
  let { hodlers, unfaithful } = await processEvents(tokenTransferEvents, whitelist)
  console.log(unfaithful)
  // console.log(hodlers)
  let newLongHodlers = await processHodlers(hodlers, blockNumber)
  // console.log(newLongHodlers)
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
 *  @param events {Array} Web3 transfer events
 *  @param whitelist {Array} Only these addresses are cared about
 *  @return {Object} Hodl club members `hodlers` and `unfaithful`
 */
async function processEvents (events, whitelist) {
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
    let canAmount = event.args.value
    if (whitelist.indexOf(receivingAddress) === -1) continue
    if (kickedOut[receivingAddress]) continue
    kickedOut[sendingAddress] = true
    if (receivers[sendingAddress]) {
      delete receivers[sendingAddress]
    }
    if (!receivers[receivingAddress]) {
      // we don't have this user yet
      if (canAmount.gte(HodlClubTokenThreshold)) {
        // this person has enough to be in the hodl club at this point!!!
        timestamp = await getBlockTimestamp(event.blockNumber)
        receiver.timestampOverThreshold = timestamp
      }
      receiver.balance = canAmount
      receivers[receivingAddress] = receiver
      delete kickedOut[receivingAddress]
    } else {
      receiver = receivers[receivingAddress]
      receiver.balance = receiver.balance.add(canAmount)
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
 *  @return {Promise<Array>} List of new hodl club members
 */
async function processHodlers (hodlers, currentBlockNumber) {
  return new Promise(async (resolve) => {
    let currentBlockTimestamp = new BigNumber(await getBlockTimestamp(currentBlockNumber))
    let newLongHodlers = []
    let count = 0
    for (let hodlerAddress in hodlers) {
      let hodlerObj = {}
      let hodler = hodlers[hodlerAddress]
      if (!hodler.timestampOverThreshold) continue
      let becameHodler = new BigNumber(hodler.timestampOverThreshold)
      let daysSinceBecameHolder = getDaysBetween(currentBlockTimestamp, becameHodler)
      hodlerObj.address = hodlerAddress
      hodlerObj.daysHodling = daysSinceBecameHolder
      hodlerObj.balance = hodler.balance
      newLongHodlers.push(hodlerObj)
      count++
    }
    console.log('Processed ' + count + ' hodlers')
    resolve(newLongHodlers)
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

main()

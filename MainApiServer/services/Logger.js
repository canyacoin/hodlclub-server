const Log = require('simple-node-logger')
const path = require('path')

const opts = {
  errorEventName: 'error',
  logDirectory: path.resolve('./MainApiServer/log'),
  fileNamePattern: 'hodl-<DATE>.log',
  dateFormat: 'YYYY.MM.DD'
}

const log = Log.createRollingFileLogger(opts)
log.niceError = function (e) {
  if (e.toString) {
    console.log('In Logger string: ' + e.toString())
    log.warn(e.toString())
  } else {
    console.log('In Logger: ' + e)
    log.warn(e)
  }
}

module.exports = log

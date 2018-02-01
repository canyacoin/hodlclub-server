const Log = require('simple-node-logger')
const path = require('path')

const opts = {
  errorEventName: 'error',
  logDirectory: path.resolve('./MainApiServer/log'),
  fileNamePattern: 'hodl-<DATE>.log',
  dateFormat: 'YYYY.MM.DD'
}

const log = Log.createRollingFileLogger(opts)

module.exports = log

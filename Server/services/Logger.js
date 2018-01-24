const Log = require('simple-node-logger')

const opts = {
  errorEventName: 'error',
  logDirectory: './log',
  fileNamePattern: 'hodl-<DATE>.log',
  dateFormat: 'YYYY.MM.DD'
}

const log = Log.createRollingFileLogger(opts)

module.exports = log

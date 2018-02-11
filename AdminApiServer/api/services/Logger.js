const Log = require('simple-node-logger')
const path = require('path')

const opts = {
  errorEventName: 'error',
  logDirectory: path.resolve('./AdminApiServer/log'),
  fileNamePattern: 'hodl-<DATE>.log',
  dateFormat: 'YYYY.MM.DD'
}

const log = Log.createRollingFileLogger(opts)
log.niceError = function (e) {
  if (e.toString) {
    log.error(e.toString())
  } else {
    log.error(e)
  }
}

module.exports = log

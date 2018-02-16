const dbConfig = require('./config/database')
const MongoClient = require('mongodb').MongoClient

const Router = require('./api/Router')
const Log = require('./services/Logger')

const ApiServer = {}

ApiServer.start = (port, proxyHost = '') => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbConfig.url, (err, client) => {
      if (err) return reject(Error(err))
      console.log('Connected to database at ' + dbConfig.url)
      const db = client.db(dbConfig.dbName)
      const server = new Router(db, proxyHost)
      server.listen(port)
      server.on('error', e => Log.niceError(e))
      console.log('HodlClub API server started at port ' + port)
      resolve()
    })
  })
}

module.exports = ApiServer

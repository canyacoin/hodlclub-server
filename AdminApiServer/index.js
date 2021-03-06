const dbConfig = require('./config/database')
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors')
const auth = require('http-auth')
const AdminApi = require('./api')
const Log = require('./api/services/Logger')

const AdminApiServer = {
  proxyHost: ''
}

const basic = auth.basic({
  realm: 'Admin Area',
  file: path.resolve('./AdminApiServer/users.htpasswd')
})

/**
 *  Starts the Admin API server on a given port
 *  @param port {Number} Port number to start the server on
 *  @param proxyHost {String} Hostname of the proxy which all requests should come through
 *  @return {Promise<Void>} Resolves when the server has started
 */
AdminApiServer.start = async (port, proxyHost = '') => {
  AdminApiServer.proxyHost = proxyHost
  AdminApiServer.bindRoutes()
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbConfig.url, (err, client) => {
      if (err) return reject(Error(err))
      const db = client.db(dbConfig.dbName)
      AdminApi.setDb(db)
      app.listen(port, () => {
        console.log('Admin server listening on ' + port)
        resolve()
      })
    })
  })
}

AdminApiServer.logErrors = (err, req, res, next) => {
  Log.niceError(err)
  res.status(500).send({ error: 'Something failed!' })
}

/**
 *  Binds the routes for this API
 */
AdminApiServer.bindRoutes = () => {
  app.use(cors())
  app.options('*', cors())
  app.use(auth.connect(basic))
  app.use(express.json())
  app.use(express.urlencoded())
  app.use(AdminApiServer.logErrors)

  app.all('/*', (req, res, next) => {
    if (AdminApiServer.proxyHost && req.headers.host !== AdminApiServer.proxyHost) {
      return res.status(404).send('Not found')
    }
    next()
  })

  app.post('/search', AdminApi.search)
  app.post('/blacklist', AdminApi.blacklist)
  app.post('/makeOG', AdminApi.makeOG)
  app.post('/exportHodlers', AdminApi.exportAllHodlers)
  app.post('/exportMembers', AdminApi.exportAllMembers)
  app.post('/exportApplications', AdminApi.exportAllApplications)

  // @todo use this for the live version
  app.use('/', express.static(path.resolve('./admin/build')))
}

module.exports = AdminApiServer

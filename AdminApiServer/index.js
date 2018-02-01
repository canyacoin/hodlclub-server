const dbConfig = require('./config/database')
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const express = require('express')
const app = express()
const auth = require('http-auth')
const AdminApi = require('./api')

const AdminApiServer = {
  proxyHost: ''
}

const basic = auth.basic({
  realm: 'Admin Area',
  file: path.resolve('./AdminApiServer/users.htpasswd')
})

AdminApiServer.start = async (port, proxyHost = '') => {
  AdminApiServer.proxyHost = proxyHost
  AdminApiServer.bindRoutes()
  return new Promise((resolve) => {
    MongoClient.connect(dbConfig.url, (err, client) => {
      const db = client.db(dbConfig.dbName)
      AdminApi.setDb(db)
      app.listen(port, () => {
        console.log('Admin server listening on ' + port)
        resolve()
      })
    })
  })
}

AdminApiServer.bindRoutes = () => {

  app.use(auth.connect(basic))
  app.use(express.json())
  app.use(express.urlencoded())

  app.all('/*', (req, res, next) => {
    if (AdminApiServer.proxyHost && req.headers.host !== AdminApiServer.proxyHost) {
      return res.status(404).send('Not found')
    }
    next()
  })

  app.post('/search', AdminApi.search)
  app.post('/blacklist', AdminApi.blacklist)
  app.post('/makeOG', AdminApi.makeOG)

  // app.use('/', express.static(path.resolve('./admin/public')))
  app.use('/', express.static(path.resolve('./admin/build')))

}

module.exports = AdminApiServer
const path = require('path')
const express = require('express')
const app = express()
const auth = require('http-auth')

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
    app.listen(port, () => {
      console.log('Admin server listening on ' + port)
      resolve()
    })
  })
}

AdminApiServer.bindRoutes = () => {

  app.use(auth.connect(basic))

  app.all('/*', (req, res, next) => {
    if (AdminApiServer.proxyHost && req.headers.host !== AdminApiServer.proxyHost) {
      return res.status(404).send('Not found')
    }
    next()
  })

  app.use('/', express.static(path.resolve('./admin/build')))

}

module.exports = AdminApiServer
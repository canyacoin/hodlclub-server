const httpProxy = require('http-proxy')
const https = require('https')
const fs = require('fs')
const path = require('path')

const sslOptions = {
  key: fs.readFileSync(path.resolve('./SSL/wildcard.canya.com.key')),
  cert: fs.readFileSync(path.resolve('./SSL/hodl.canya.com.cer')),
  ca: fs.readFileSync(path.resolve('./SSL/wildcard.canya.com.chain'))
}

const proxy = httpProxy.createProxyServer({ ssl: sslOptions })

const RequestProxy = {}

RequestProxy.start = (ports) => {
  return new Promise((resolve) => {
    const server = https.createServer(sslOptions, (req, res) => {
      let host = req.headers.host
      if (host.indexOf('api.') === 0) {
        proxy.web(req, res, { target: 'https://localhost:' + ports.api })
      } else if (host.indexOf('admin.') === 0) {
        proxy.web(req, res, { target: 'https://localhost:' + ports.admin })
      } else if (host.indexOf('adminpanel.') === 0) {
        proxy.web(req, res, { target: 'http://localhost:' + ports.adminpanel })
      } else {
        proxy.web(req, res, { target: 'https://localhost:' + ports.hodl })
      }
    })

    server.listen(ports.proxy)
    console.log('Proxy listening on ' + ports.proxy)
    resolve()
  })
}

module.exports = RequestProxy
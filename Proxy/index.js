const httpProxy = require('http-proxy')
const https = require('https')
const fs = require('fs')

const proxy = httpProxy.createProxyServer({ ssl: {
  key: fs.readFileSync(path.resolve('./SSL/wildcard.canya.com.key')),
  cert: fs.readFileSync(path.resolve('./SSL/wildcard.canya.com_Expires_01Feb2021.cer')),
  ca: fs.readFileSync(path.resolve('./SSL/wildcard.canya.com.chain'))
} })

const RequestProxy = {}

RequestProxy.start = (ports) => {
  return new Promise((resolve) => {
    const server = https.createServer(options, (req, res) => {
      let host = req.headers.host
      if (host.indexOf('api.') === 0) {
        proxy.web(req, res, { target: 'http://localhost:' + ports.api })
      } else if (host.indexOf('admin.') === 0) {
        proxy.web(req, res, { target: 'http://localhost:' + ports.admin })
      } else if (host.indexOf('adminpanel.') === 0) {
        proxy.web(req, res, { target: 'http://localhost:' + ports.adminpanel })
      } else {
        proxy.web(req, res, { target: 'http://localhost:' + ports.hodl })
      }
    })

    server.listen(ports.proxy)
    console.log('Proxy listening on ' + ports.proxy)
    resolve()
  })
}

module.exports = RequestProxy
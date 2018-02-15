const httpProxy = require('http-proxy')
const https = require('https')
const http = require('http')
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
      if (host.indexOf('hodladmin.') === 0) {
        proxy.web(req, res, { target: 'https://localhost:' + ports.admin })
      } else {
        proxy.web(req, res, { target: 'https://localhost:' + ports.hodl })
      }
    })

    server.listen(ports.proxy)
    server.on('error', (err) => {
      console.log(err)
    })
    console.log('Proxy listening on ' + ports.proxy)

    const httpServer = http.createServer((req, res) => {
      res.writeHead(302, {
        'Location': 'https://hodl.canya.com:' + ports.proxy
      })
      res.end()
    })

    httpServer.listen(ports.httpProxy)
    httpServer.on('error', (err) => {
      console.log(err)
    })
    resolve()
  })
}

module.exports = RequestProxy
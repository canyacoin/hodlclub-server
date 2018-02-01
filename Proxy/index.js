const httpProxy = require('http-proxy')
const http = require('http')

const proxy = httpProxy.createProxyServer({})

const RequestProxy = {}

RequestProxy.start = (ports) => {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let host = req.headers.host
      if (host.indexOf('api.') === 0) {
        proxy.web(req, res, { target: 'http://localhost:' + ports.api })
      } else if (host.indexOf('admin.') === 0) {
        proxy.web(req, res, { target: 'http://localhost:' + ports.admin })
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
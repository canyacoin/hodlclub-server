const http = require('http')
const qs = require('querystring')
const fs = require('fs')

const Log = require('../services/Logger')
const HodlerApi = require('./HodlerApi')

function Router (db, proxy = '') {
  var options = {
    // key: fs.readFileSync('/path/to/privkey.pem'),
    // cert: fs.readFileSync('/path/to/fullchain.pem'),
    // ca: fs.readFileSync('/path/to/chain.pem')
  }

  this.proxyHost = proxy

  this.server = http.createServer((req, res) => {
    return this.handleRequest(req, res)
  })

  this.hodlerApi = new HodlerApi(db)
  this.ROUTES = {
    '/bestHodlers': this.hodlerApi.bestHodlers,
    '/bestHodlerOGs': this.hodlerApi.bestHodlerOGs,
    '/tokensAirdropped': this.hodlerApi.tokensAirdropped,
    '/getHodlStats': this.hodlerApi.getHodlStats,
    '/submitHodlApplication': this.hodlerApi.submitApplication
  }
  this.ALLOWED_ENDPOINTS = Object.keys(this.ROUTES)
}

Router.prototype.listen = function (port) {
  this.server.listen(port, () => {
    Log.info('Listening at ' + port)
  })
}

Router.prototype.handleRequest = function (req, res) {
  if (this.proxyHost && req.headers.host.indexOf(this.proxyHost) !== 0) {
    this.unauthorisedRequest(res)
  } else if (req.method === 'POST' || req.method === 'GET') {
    this.parseRequest(req, res)
  } else {
    this.unauthorisedRequest(res)
  }
}

Router.prototype.unauthorisedRequest = function (res) {
  res.writeHead(403, {'Content-Type': 'text/json'})
  res.write(JSON.stringify({'error': 'Unauthorised'}))
  res.end()
}

Router.prototype.parseRequest = async function (req, res) {
  let query
  let url
  if (req.method === 'GET') {
    let q = this.parseGet(req)
    query = q.query
    url = q.url
  } else {
    query = await this.parsePost(req)
    url = req.url
  }
  this.routeRequest(req, res, url, query)
}

Router.prototype.parseGet = function (req) {
  let querystring = req.url.substr(req.url.indexOf('?') + 1, req.url.length)
  let url = req.url.substr(0, req.url.indexOf('?'))
  let parsed = qs.parse(querystring)
  return { query: parsed, url: url }
}

Router.prototype.parsePost = function (req) {
  return new Promise((resolve) => {
    let requestBody
    req.on('data', (data) => {
      requestBody += data
    })
    req.on('end', () => {
      if (!requestBody) requestBody = ''
      requestBody = requestBody.replace('undefined', '')
      let postData = JSON.parse(requestBody)
      resolve(postData)
    })
  })
}

Router.prototype.routeRequest = function (req, res, url, data) {
  if (this.ALLOWED_ENDPOINTS.indexOf(url) !== -1) {
    Log.info('Routing to: ' + url)
    this.ROUTES[url](req, res, data)
  } else {
    this.unauthorisedRequest(res)
  }
}

module.exports = Router

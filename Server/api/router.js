const http = require('http')
const qs = require('querystring')
const fs = require('fs')

const Log = require('../services/Logger')
const HodlerApi = require('./hodlerApi')

function Router () {
  var options = {
    // key: fs.readFileSync('/path/to/privkey.pem'),
    // cert: fs.readFileSync('/path/to/fullchain.pem'),
    // ca: fs.readFileSync('/path/to/chain.pem')
  }

  this.server = http.createServer((req, res) => this.handleRequest(req, res))

  this.hodlerApi = new HodlerApi()
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
  if (req.method === 'POST' || req.method === 'GET') {
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
  if (req.method === 'GET') {
    query = this.parseGet(req)
  } else {
    query = await this.parsePost(req)
  }
  this.routeRequest(req, res, query)
}

Router.prototype.parseGet = function (req) {
  let querystring = req.url.substr(req.url.indexOf('?') + 1, req.url.length)
  let parsed = qs.parse(querystring)
  return parsed
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
      let postData = qs.parse(requestBody)
      resolve(postData)
    })
  })
}

Router.prototype.routeRequest = function (req, res, data) {
  if (this.ALLOWED_ENDPOINTS.indexOf(req.url) !== -1) {
    Log.info('Routing to: ' + req.url)
    this.ROUTES[req.url](req, res, data)
  } else {
    this.unauthorisedRequest(res)
  }
}

module.exports = Router

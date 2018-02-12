const https = require('https')
const qs = require('querystring')
const fs = require('fs')
const path = require('path')

const Log = require('../services/Logger')
const HodlerApi = require('./HodlerApi')

function Router (db, proxy = '') {
  const options = {
    key: fs.readFileSync(path.resolve('./SSL/wildcard.canya.com.key')),
    cert: fs.readFileSync(path.resolve('./SSL/wildcard.canya.com_Expires_01Feb2021.cer')),
    ca: fs.readFileSync(path.resolve('./SSL/wildcard.canya.com.chain'))
  }

  this.proxyHost = proxy

  this.server = https.createServer(options, (req, res) => {
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
    try {
      query = await this.parsePost(req)
      url = req.url
    } catch (error) {
      Log.niceError(error)
      return this.unauthorisedRequest(res)
    }
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

const Log = require('../services/Logger')

let ResponseHandler = {}

// 200 OK
ResponseHandler.success = (res, data) => {
  Log.info('Returning success with data:')
  Log.info(data)
  res.writeHead(200, {'Content-Type': 'text/json', 'Access-Control-Allow-Origin': '*'})
  res.write(JSON.stringify({success: true, data: data}))
  res.end()
}

// 400 Bad Request
ResponseHandler.badRequest = (res, errors) => {
  Log.info('Returning bad request with errors')
  Log.info(errors)
  res.writeHead(400, {'Content-Type': 'text/json'})
  res.write(JSON.stringify({errors: errors}))
  res.end()
}

// 403 Unauthorised
ResponseHandler.unauthorised = (res) => {
  Log.info('Returning unauthorised')
  res.writeHead(403, {'Content-Type': 'text/json'})
  res.end()
}

// 200 OK (without data)
ResponseHandler.ok = (res, data) => {
  Log.info('Returning OK')
  res.writeHead(200, {'Content-Type': 'text/json'})
  res.end()
}

// 404 Not Found
ResponseHandler.notFound = (res) => {
  Log.info('Returning not found')
  res.writeHead(404, {'Content-Type': 'text/json'})
  res.end()
}

// 500 Server Error
ResponseHandler.serverError = (res) => {
  Log.info('Returning server error')
  res.writeHead(500, {'Content-Type': 'text/json'})
  res.end()
}

module.exports = ResponseHandler

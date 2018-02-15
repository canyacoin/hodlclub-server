let ResponseHandler = {}

// 200 OK
ResponseHandler.success = (res, data) => {
  res.writeHead(200, {'Content-Type': 'text/json', 'Access-Control-Allow-Origin': '*'})
  res.write(JSON.stringify({success: true, data: data}))
  res.end()
}

// 200 OK
ResponseHandler.fail = (res, data) => {
  res.writeHead(200, {'Content-Type': 'text/json', 'Access-Control-Allow-Origin': '*'})
  res.write(JSON.stringify({success: false, errors: data}))
  res.end()
}

// 400 Bad Request
ResponseHandler.badRequest = (res, errors) => {
  res.writeHead(400, {'Content-Type': 'text/json'})
  res.write(JSON.stringify({errors: errors}))
  res.end()
}

// 403 Unauthorised
ResponseHandler.unauthorised = (res) => {
  res.writeHead(403, {'Content-Type': 'text/json'})
  res.end()
}

// 200 OK (without data)
ResponseHandler.ok = (res, data) => {
  res.writeHead(200, {'Content-Type': 'text/json'})
  res.end()
}

// 404 Not Found
ResponseHandler.notFound = (res) => {
  res.writeHead(404, {'Content-Type': 'text/json'})
  res.end()
}

// 500 Server Error
ResponseHandler.serverError = (res) => {
  res.writeHead(500, {'Content-Type': 'text/json'})
  res.end()
}

module.exports = ResponseHandler

const Log = require('./services/Logger')
const Router = require('./api/router')

const server = new Router()

const port = 3000
server.listen(port)
Log.info('Server started at port ' + port)

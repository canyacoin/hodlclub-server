const dbConfig = require('./config/database')
const MongoClient = require('mongodb').MongoClient

const Log = require('./services/Logger')
const Router = require('./api/Router')

MongoClient.connect(dbConfig.url, (err, client) => {
  if (err) throw new Error(err)
  console.log('Connected to database at ' + dbConfig.url)
  const db = client.db(dbConfig.dbName)
  const server = new Router(db)
  const port = 3000
  server.listen(port)
  Log.info('Server started at port ' + port)
})

require('dotenv').config()
const config = require('./config')
const ports = config.ports
const fqdns = config.fqdns

const MainApiServer = require('./MainApiServer')
const AdminApiServer = require('./AdminApiServer')
const RequestProxy = require('./Proxy')

async function main () {
  try {
    await MainApiServer.start(ports.hodl, fqdns.hodl)
    await AdminApiServer.start(ports.admin, fqdns.admin)
    await RequestProxy.start(ports)
  } catch (error) {
    throw new Error(error)
    process.exit(1)
  }
}

main()
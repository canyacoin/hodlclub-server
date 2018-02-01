const config = require('./config')
const ports = config.ports
const fqdns = config.fqdns

const MainApiServer = require('./MainApiServer')
const AdminApiServer = require('./AdminApiServer')
const RequestProxy = require('./Proxy')

async function main () {
  // now figure out how to start the react sites from inside this script
  await MainApiServer.start(ports.api, fqdns.api + ':' + ports.proxy)
  await AdminApiServer.start(ports.admin, fqdns.admin + ':' + ports.proxy)
  await RequestProxy.start(ports)

}

main()
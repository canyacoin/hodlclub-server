module.exports = {
  url: process.env.MONGODB_URL,
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  dbName: process.env.MONGODB_DB_NAME,
  applicationTable: 'hodlerApplications',
  hodlerTable: 'hodlers',
  longHodlerTable: 'longHodlers',
  blacklistTable: 'blacklistedAddresses'
}

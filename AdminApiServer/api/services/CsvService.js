const fastcsv = require('fast-csv')

const CsvService = {}

/**
 *  Sends a file back as a response, prompting the user to download
 *  @param cursor {Object} Mongodb query cursor
 *  @param transform {Function} Transform function to create headings for the document
 *  @param filename {String} Name of the file to create
 *  @param response {Object} Express response object
 */
CsvService.download = (cursor, transform, filename, response) => {
  response.setHeader('Content-disposition', `attachment; filename=${filename}`)
  response.writeHead(200, { 'Content-Type': 'text/csv' })
  response.flushHeaders()
  let csvStream = fastcsv.createWriteStream({headers: true}).transform(transform)
  cursor.stream().pipe(csvStream).pipe(response)
}

module.exports = CsvService

const fastcsv = require('fast-csv')

const CsvService = {}

CsvService.download = (cursor, transform, filename, response) => {
  response.setHeader('Content-disposition', `attachment; filename=${filename}`)
  response.writeHead(200, { 'Content-Type': 'text/csv' })
  response.flushHeaders()
  let csvStream = fastcsv.createWriteStream({headers: true}).transform(transform)
  cursor.stream().pipe(csvStream).pipe(response)
}

module.exports = CsvService
const nodemailer = require('nodemailer')

let Email = {}

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'yl3p7pzvi73qwi5o@ethereal.email',
    pass: 'usMb65nm5v8MqNjQsG'
  }
})

Email.send = async (to, content) => {
  return new Promise((resolve) => {
    console.log('SENDING EMAIL')
    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: 'tommynosh@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>' // html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: %s', info.messageId)
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

      resolve()

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    })
  })
}

module.exports = Email

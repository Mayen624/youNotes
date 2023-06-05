const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.API_SEND_EMAIL, // generated ethereal user
        pass: process.env.PSW_GOOGLE_APLICATION, // generated ethereal password
    },
});

transporter.verify().then(() => {
    console.log('Redy for send emails');
})


module.exports = {transporter};
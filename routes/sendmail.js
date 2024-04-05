const expressAsyncHandler = require("express-async-handler");

const sendEmail = expressAsyncHandler( async(req, res) => {
const mailOptions = {
    from: process.env.Auth_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Enter  >b>${otp}</b> in the app to verify your email address and complete the signin</p><p>This code <b> expires in 1 hours </b> </p>`
}; 
})


const express = require("express");
const userRouter = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getOtp = require("../models/otp.js");
const otpGenerator = require('otp-generator');
const sendEmail = require("../utils/nodemailer.js");


userRouter.post("/signup", async(req, res) => {
    const {username,email, password} = req.body;

    if(!username ||!email || !password){
        return res.status(400).json({message:"Please Enter All Field"});
    }

    const already = await User.findOne({email});


    if(already){
        return res.status(400).json({message: "Already Register Email, Please Login"});
    }

     const salt = await bcrypt.genSalt(Number(process.env.SALT));

     const hassedPassword = await bcrypt.hashSync(password, salt)

    let enteremail;

    try {
        enteremail = new User({
            username,email, password: hassedPassword, verified:false
        })
    } catch (error) {
        return res.status(400).json({error, message: "Internal server error, Please check Internet"});
    }

    try {
        await enteremail.save();
    } catch (error) {
        return res.status(400).json({error, message: "Internal server error, Please check Internet"});
    }

     return res.status(200).json({enteremail, message:"User Register Successfully"})
});


const sendOtp = () => {
    const generateotp = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false});

    return generateotp;
}

const otps = sendOtp();


userRouter.post("/signin", async(req, res) => {
    const {email, password} = req.body;


    if (!email) {
      return res.status(400).json({ message: 'Please Enter Email' });
    }
  
    if (!password) {
      return res.status(400).json({ message: 'Please Enter Password' });
    }
    
      let existing;
      try {
          existing = await User.findOne({email});
      } catch (error) {
          console.log(error);
      }
  
     if(!existing){
      return res.status(400).json({message: "Please Register, After Login"});
     }
  
     const comparePassword = await bcrypt.compareSync(password, existing.password);
  
  
     if(!comparePassword){
      return res.status(400).json({message: "Incorrect Password"});
     }
  
     const token = jwt.sign({_id: this._id}, process.env.JWTKEY ,
      {
          "expiresIn":"1h"
      })

      let updateotp = new getOtp({

        email, otp: otps

      });

      

      await updateotp.save();

      

      const subject = "Verify Your Email";

      const html = `<p>Enter <b>${otps}</b> in the app to verify your email address and complete the signin</p><p>This code <b> expires in 1 hours </b> </p>`

      sendEmail(email,subject, html)

  
      return res.status(200).json({data: token, message: "Login Sucessfully", otp: updateotp,user: existing});
    
  
});


userRouter.get(`/getuser/:id`, async(req, res) => {
    let user;
    try {
      user = await User.findOne({ _id: req.params.id });
    } catch (error) {
        
        res.status(500).send(error);
    }

    return res.status(200).json(  user );

})


userRouter.get(`/getotp/:id`, async(req, res) => {
 


   let otp;

   try {
    
    otp = await getOtp.findOne({ _id: req.params.id });

   } catch (error) {
    return res.status(500).send(error)
   }
   

   return res.status(201).json( otp )

    
})


userRouter.delete(`/getotp/detele/:id`, async(req, res) => {
    let otp;

    try {
        otp = await getOtp.findByIdAndDelete(req.params.id);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }

    return res.status(201).json({ otp, message:"delete suuccessfully" });

})


module.exports = userRouter;


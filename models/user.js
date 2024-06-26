const mongoose = require("mongoose");



const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
       required: true
    },
    verified:{
      type:Boolean,
      required: true
    }

}, { timestamps: true });


const user = new mongoose.model("User", UserSchema);

module.exports = user
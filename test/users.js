const mongoose = require('mangoose')
const passportLocalMangoose = require('passport-local-mangoose')

var user = {name: "", Add: [String]}

const userSchema = new mangoose.Schema({
    username:{
        type: String, 
        minLength: 5
    },

    password: {
        type: String, 
    }
    
})

userSchema.plugin(passportLocalMangoose)
module.exports = mangoose.model("User", userSchema)
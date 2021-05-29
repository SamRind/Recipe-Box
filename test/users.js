const mongoose = require('mongoose');
//const passportLocalMongoose = require('passport-local-mongoose')

//var users = {name: "", Add: [String]}

const userSchema = new mongoose.Schema({
    username:{
        type: String, 
        minLength: 3
    },

    password: {
        type: String, 
    }
    
})

//userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("user", userSchema)
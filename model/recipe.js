const mongoose = require('mongoose')

const sampleSchema = new mongoose.Schema({
    name: {
        type: String
    },
    Ingredients: {
        type: String
    },
    Prep: {
        type: String
    },
    Bookmark: {
        type: Boolean
    },
})

module.exports = mongoose.model("recipe", sampleSchema);
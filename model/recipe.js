//This is the file for the schema for the recipe databas
//Program Authors: Sam Rind, Leah Moser, Shay Green
//Full-Stack 465/565
//Spring 2021

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
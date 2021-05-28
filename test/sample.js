const mongoose = require('mongoose')

const sampleSchema = new mongoose.Schema({
    Add: {
        type: String
    }
});

module.exports = mongoose.model("sample", sampleSchema); 
const mangoose = require("mongoose")

const sampleSchema = new mangoose.Schema({
    Add: {
        type: String
});

module.exports = mangoose.model("sample", sampleSchema); 
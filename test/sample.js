const mangoose = require("mongoose")

const sampleSchema = new mangoose.Schema({
    Add: {
        type: String
});

module.exports = mangoose.test("sample", sampleSchema); 
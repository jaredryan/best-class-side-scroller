const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    number: {
        type: Number,
        required: true
    },
    level: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Score", scoreSchema);

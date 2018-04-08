const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    number: {
        type: Number,
        required: true
    },
    level: Number,
    username: String
})

module.exports = mongoose.model("Score", scoreSchema);

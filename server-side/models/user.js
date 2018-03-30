const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('mongoose-type-email');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    highscores: {
        level1: {
            type: Number,
            default: 0
        },
        level2: {
            type: Number,
            default: 0
        },
        level3: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: Number,
        enum: ["1", "2", "3"]
    }
})

module.exports = mongoose.model("User", userSchema)

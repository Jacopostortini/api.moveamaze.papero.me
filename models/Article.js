const {defaultDelay} = require("../constants/constants");

const mongoose = require("mongoose")

const ArticleSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: String,
    code: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Number,
        default: Date.now()+defaultDelay
    },
    insertionDate: {
        type: Number,
        default: Date.now()
    }
})

module.exports = mongoose.model("Article", ArticleSchema)
const mongoose = require("mongoose")
const crypto = require("crypto");
require("dotenv").config()
mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true})

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        primaryKey: true,
        default: crypto.randomBytes(20).toString('hex')
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    scannerId: {
        type: String,
        default: crypto.randomBytes(20).toString("hex")
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("User", UserSchema)
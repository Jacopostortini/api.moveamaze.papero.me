const mongoose = require("mongoose")

const GameSchema = new mongoose.Schema({
    status: {
        type: Number,
        default: 0 //0 == lobby, 1 == playing, 2 == ended
    },
    playersIds: { //User ids
        type: Array,
        default: []
    },
    admin: { //User id
        type: Number,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("Game", GameSchema);
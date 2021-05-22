const mongoose = require("mongoose");
const GameSchema = new mongoose.Schema({
    status: {
        type: Number,
        default: 0
    },
    players: {
        type: Object,
        default: {}
    },
    admin: {
        type: Number,
        required: true
    },
    tiles: {
        type: Object,
        default: {}
    },
    gameId: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("Game", GameSchema);

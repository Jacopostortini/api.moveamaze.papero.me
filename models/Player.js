const mongoose = require("mongoose")

const PlayerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    socket: {
        type: Object,
        default: {}
    },
    games: { //{ "gameId": {id: String, cards: {"cardId": {id: String, reached: Boolean}}, localId: Number, color: Number, position: Array } }
        type: Object,
        default: {}
    }
}, {timestamps: true});

module.exports = mongoose.model("Player", PlayerSchema);
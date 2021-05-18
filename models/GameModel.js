const mongoose = require("mongoose")

const GameSchema = new mongoose.Schema({
    status: { //0 == lobby, 1 == playing, 2 == ended
        type: Number,
        default: 0
    },
    playersIds: { //{"userId": userId}
        type: Object,
        default: {}
    },
    admin: { //User id
        type: Number,
        required: true
    },
    tiles: { // {"tileId": {id: Number, position: Array, rotation: Number}
        type: Object,
        default: {}
    }
}, {timestamps: true});

module.exports = mongoose.model("Game", GameSchema);
import * as mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    socketId: String,
    activeGameId: String
}, {timestamps: true});

module.exports = mongoose.model("Player", PlayerSchema);
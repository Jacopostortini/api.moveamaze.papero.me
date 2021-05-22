const cookie = require("cookie");
const Player = require("../managers/Player");
const Game = require("../managers/Game");

const gameConfig = {
    maxPlayers: 4
}

const getCookies = (socket) => {
    try {
        return cookie.parse(socket.handshake.headers.cookie);
    } catch (e) {
        console.log(e)
        return null
    }
}

const findPlayerAndGameBySocketId = (socketId) => {
    const player = Player.findBySocketId(socketId);
    if(!player) return {player: null, game: null};
    const game = Game.findByGameId(player.activeGameId);
    return {player, game};
}

const broadcastDataToPlayers = (endpoint, io, data, gameId) => {
    const players = Player.findByGameId(gameId);
    for(const userId in players){
        io.sockets.connected[players[userId].socketId].emit(endpoint, data);
    }
}

module.exports = {gameConfig, getCookies, findPlayerAndGameBySocketId, broadcastDataToPlayers};

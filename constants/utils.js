const cookie = require("cookie");
const Player = require("../managers/Player");
const Game = require("../managers/Game");

const getCookies = (socket) => {
    try {
        return cookie.parse(socket.handshake.headers.cookie);
    } catch (e) {
        console.log(e)
        return null
    }
}

const findPlayerAndGameBySocketId = async (socketId) => {
    const player = await Player.findBySocketId(socketId);
    if(!player) return {player: null, game: null};
    const game = await Game.findByGameId(player.activeGameId);
    return {player, game};
}

const broadcastGameToPlayers = (endpoint, io, game) => {
    console.log(game)
    const players = Player.findByGameId(game.gameId);
    console.log(players)
    for(const userId in players){
        console.log(userId)
        io.sockets.connected[players[userId].socketId].emit(endpoint, game.getGame(userId));
    }
}

module.exports = {getCookies, findPlayerAndGameBySocketId, broadcastGameToPlayers};

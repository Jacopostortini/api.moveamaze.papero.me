const endpoints = require("./constants/endpoints");
const Player = require("./managers/Player");
const Game = require("./managers/Game");
const {broadcastDataToPlayers, findPlayerAndGameBySocketId, getCookies} = require("./constants/constants");

module.exports = (http) => {
  const io = require("socket.io")(http);

  io.on("connection", socket => {
    //get username and userId from cookies
    const cookies = getCookies(socket);
    const {userId, username} = cookies;

    socket.on(endpoints.CONNECT_TO_GAME, async data => {
      //get gameId from data
      let {gameId} = data;
      if(!userId || !gameId) return null;
      gameId = gameId.toLowerCase();

      //Replace socketId and activeGameId of player instance or create a new one
      let player = await Player.findByUserId(userId);
      if(player){
        player.socketId = socket.id;
        player.activeGameId = gameId;
      } else {
        player = new Player({
          userId: userId,
          activeGameId: gameId,
          socketId: socket.id
        });
      }
      await player.save();

      //get game if it does exists and create one if it does not
      let game = await Game.findByGameId(gameId);
      if(!game){
        game = await Game.createFromPlayerAndGameId({player, gameId, username});
        await game.save();
      } //TODO: status >= 1 ? implement online-offline

      //Respond with the whole game
      socket.emit(endpoints.LOBBY_MODIFIED, game.getGame(userId));
    });

    socket.on(endpoints.JOIN_GAME, async () => {
      //Get player and active game
      const {player, game} = await findPlayerAndGameBySocketId(socket.id);
      if(!player || !game) return null;
      //Add player to game
      game.addPlayer({player, username});
      await game.save();
      //Update game
      broadcastDataToPlayers(endpoints.LOBBY_MODIFIED, io, game.getGame(userId), game.gameId);
    });

    socket.on(endpoints.QUIT_GAME, async () => {
      //Get player and active game
      const {player, game} = await findPlayerAndGameBySocketId(socket.id);
      if(!player || !game) return null;
      //Remove player from game
      game.removePlayer(player);
      await game.save();
      //Update game
      broadcastDataToPlayers(endpoints.LOBBY_MODIFIED, io, game.getGame(userId), game.gameId);
    });

    socket.on(endpoints.CHANGE_COLOR, async color => {
      //Get player and active game
      const {player, game} = await findPlayerAndGameBySocketId(socket.id);
      if(!player || !game) return null;
      if(game.players[player.userId]){
        if(game.isColorAvailable(color)) {
          game.players[player.userId].color = color;
          await game.save();
          broadcastDataToPlayers(endpoints.LOBBY_MODIFIED, io, game.getGame(), game.gameId);
        }
      }
    });

    socket.on("disconnect", async () => {
      //Get player and active game
      const {player, game} = await findPlayerAndGameBySocketId(socket.id);
      if(!player || !game) return null;
      if(game.status === 0){
        game.removePlayer(player);
        if(Object.entries(game.players).length === 0){
          await game.remove();
        } else {
          await game.save();
          broadcastDataToPlayers(endpoints.LOBBY_MODIFIED, io, game.getGame(userId), game.gameId);
        }
      } else {
        //TODO: IMPLEMENT online-offline
      }

    });

  });

  return io;
};

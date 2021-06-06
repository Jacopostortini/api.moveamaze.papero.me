const endpoints = require("./constants/endpoints");
const Player = require("./managers/Player");
const Game = require("./managers/Game");
const {broadcastGameToPlayers, findPlayerAndGameBySocketId, getCookies} = require("./constants/utils");

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

      //get game if it exists and create one if it does not
      let game = await Game.findByGameId(gameId);
      if(!game){
        game = await Game.createFromPlayerAndGameId({player, gameId, username});
      } else if(game.status > 0){
        if(game.players[player.userId]){
          game.players[player.userId].online = true;
        }
      }
      await game.save();

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
      broadcastGameToPlayers(endpoints.LOBBY_MODIFIED, io, game);
    });

    socket.on(endpoints.QUIT_GAME, async () => {
      //Get player and active game
      const {player, game} = await findPlayerAndGameBySocketId(socket.id);
      if(!player || !game) return null;
      //Remove player from game
      game.removePlayer(player);
      await game.save();
      //Update game
      broadcastGameToPlayers(endpoints.LOBBY_MODIFIED, io, game);
    });

    socket.on(endpoints.CHANGE_COLOR, async color => {
      console.log("change color:", color);
      //Get player and active game
      const {player, game} = await findPlayerAndGameBySocketId(socket.id);
      if(!player || !game) return null;
      if(game.players[player.userId]){
        //Check if color is available
        if(game.isColorAvailable(color)) {
          //Change color, save game and send lobby modified
          game.players[player.userId].color = color;
          await game.save();
          broadcastGameToPlayers(endpoints.LOBBY_MODIFIED, io, game);
          socket.emit(endpoints.CHANGE_COLOR, true);
        } else {
          //Find the user who owns the color and send him a request to switch
          const ownerId = game.findUserIdByColor(color);
          if(ownerId){
            const owner = await Player.findByUserId(ownerId);
            const data = {
              requester: game.players[player.userId].localId
            }
            io.sockets.connected[owner.socketId].emit(endpoints.REQUEST_SWITCH_COLOR, data);
          }
        }
      }
    });

    socket.on(endpoints.REQUEST_SWITCH_COLOR, async data => {
      const {response, requester} = data;
      //Check if the response is affirmative
      if(response){
        //Get player and game
        const {player, game} = findPlayerAndGameBySocketId(socket.id);
        if(!player || !game) return null;
        //Find the user id of the one who requested the switch in the first place
        const requesterId = game.findUserIdByLocalId(requester);
        if(!requesterId) return null;
        //Switch the colors, save the game and send lobby modified
        const requesterColor = game.players[requesterId].color;
        game.players[requesterId].color = game.players[player.userId].color;
        game.players[player.userId].color = requesterColor;

        await game.save();
        broadcastGameToPlayers(endpoints.LOBBY_MODIFIED, io, game)
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
          broadcastGameToPlayers(endpoints.LOBBY_MODIFIED, io, game);
        }
      } else {
        if(game.players[player.userId]) {
          game.players[player.userId].online = false;
          await game.save();
          const data = {
            localId: game.players[player.userId].localId,
            online: false
          }
          broadcastGameToPlayers(endpoints.ONLINE_STATE_CHANGED, io, game);
        }
      }

    });

  });

  return io;
};

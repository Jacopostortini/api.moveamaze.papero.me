import endpoints from "./constants/endpoints";
import Player from "./managers/Player";
import Game from "./managers/Game";
import {getCookies} from "./constants/constants";

export default (http) => {
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
          userId,
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
      //TODO: send game to connecting player
    });

    socket.on(endpoints.JOIN_GAME, async () => {
      //Get player and active game
      const player = await Player.findBySocketId(socket.id);
      if(!player) return null;
      const game = await Game.findByGameId(player.activeGameId);
      if(!game) return null;

      //Add player to game
      game.addPlayer({player, username});
      await game.save();

      //Update game
      //TODO: send game to everybody
    });

  });

  return io;
};

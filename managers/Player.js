const PlayerModel = require("../models/PlayerModel");
const Game = require("./Game");

class Player extends PlayerModel{
  constructor(object){
    console.log(object)
    super(object);
    /*
     * this.userId = object.userId;
     * this.socketId = object.socketId;
     * this.activeGameId = object.activeGameId;
     * this.save();
     * this.remove();
     */
  }

  static async findByUserId(userId){
    const playerModel = await PlayerModel.findOne({userId}).exec();
    return new Player(playerModel);
  }

  static async findByGameId(gameId){
    const game = Game.findByGameId(gameId);
    const players = {};
    for(const userId in game.players){
      players[userId] = this.findByUserId(userId);
    }
    return players;
  }

  static async findBySocketId(socketId){
    const playerModel = await PlayerModel.findOne({socketId}).exec();
    return new Player(playerModel);
  }
}

module.exports = Player;

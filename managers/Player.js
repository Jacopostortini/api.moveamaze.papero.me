const PlayerModel = require("../models/PlayerModel");
const Game = require("./Game");

class Player extends PlayerModel{
  constructor(object){
    console.log("new player", object);
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
    if(playerModel) return new Player(playerModel);
    else return null;
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
    if(playerModel) return new Player(playerModel);
    else return null;
  }
}

module.exports = Player;

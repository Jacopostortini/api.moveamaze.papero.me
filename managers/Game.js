import GameModel from "../models/GameModel";
import {gameConfig} from "../constants/constants";

class Game extends GameModel{
    constructor(object){
        super(object);
        /*
        * this.status = object.status; // 0, 1, 1.5, 2
        * this.admin = object.admin; // userId
        * this.tiles = object.tiles; // {tileId: {tileId: Number, position: Array, rotation: Number}
        * this.gameId = object.gameId; // gameId
        * this.players = object.players; // {
        *                                userId: {
        *                                  userId: String,
        *                                  localId: String,
        *                                  username: String,
        *                                  cards: {
        *                                        cardId: {
        *                                          cardId: String,
        *                                          reached: Boolean
        *                                        }
        *                                  },
        *                                  color: Number,
        *                                  position: Array
        *                                }
        *                              }
        * this.save();
        * this.remove();
        */
    }

    static async findByGameId(gameId){
        const gameModel = await GameModel.findOne({gameId}).exec();
        return new Game(gameModel);
    }

    static createFromPlayerAndGameId({player, gameId, username}){
        const players = {};
        players[player.userId+""] = {
            userId: player.userId,
            localId: Date.now(),
            username,
            color: 0
        };
        return new Game({
            admin: player.userId,
            gameId,
            players
        });
    }

    getGame(userId = null){
        if(this.status === 0){

        } else if(this.status === 1 || this.status === 1.5){

        } else if(this.status === 2){

        }
    }

    addPlayer({player, username}){
        if(this.status !== 0) return null;
        if(Object.entries(this.players).length >= gameConfig.maxPlayers) return null;

        this.players[player.userId+""] = {
            userId: player.userId,
            localId: Date.now(),
            username,
            color: this.getFirstAvailableColor()
        }
    }

    getFirstAvailableColor(){
        for(let i = 0; i < gameConfig.maxPlayers; i++){
            let used = false;
            for(const userId in this.players){
                if(this.players[userId].color === i) used = true;
            }
            if(!used) return i;
        }
        return null;
    }
}

module.exports = Game;

const GameModel = require("../models/GameModel");
const {gameConfig} = require("../constants/constants");

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
        if(gameModel) return new Game(gameModel);
        else return null;
    }

    static createFromPlayerAndGameId({player, gameId, username}){
        const players = {};
        players[player.userId] = {
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

    getGame(userId){
        let yourLocalId = null;
        if(userId){
            if(this.players[userId]){
                yourLocalId = this.players[userId].localId;
            }
        }
        if(this.status === 0){
            const data = {
                status: this.status,
                admin: this.players[this.admin].localId,
                yourLocalId,
                players: {}
            }
            for(const userId in this.players){
                const {localId, username, color} = this.players[userId];
                data.players[localId] = {localId, username, color};
            }
            console.log("getGame: ", data);
            return data;
        } else if(this.status === 1 || this.status === 1.5){

        } else if(this.status === 2){

        }
    }

    addPlayer({player, username}){
        if(this.status !== 0) return null;
        if(Object.entries(this.players).length >= gameConfig.maxPlayers) return null;

        this.players[player.userId] = {
            userId: player.userId,
            localId: Date.now(),
            username,
            color: this.getFirstAvailableColor()
        }
    }

    removePlayer(player){
        if(this.status !== null) return null;
        if(!this.players[player.userId]) return null;
        if(this.admin === player.userId) {
            this.admin = this.getFirstAvailableAdmin();
        }
        delete this.players[player.userId];
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

    getFirstAvailableAdmin(){
        for(const userId in this.players){
            if(userId !== this.admin) return userId;
        }
        return null;
    }

    isColorAvailable(color){
        for(const userId in this.players){
            if(this.players[userId].color === color) return false;
        }
        return true;
    }
}

module.exports = Game;

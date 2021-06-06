module.exports = {
    CONNECT_TO_GAME: "connect-to-game", //(gameId (userId, username from cookies)) => game to sender

    JOIN_GAME: "join-game", //() => game to everybody
    QUIT_GAME: "quit-game", //() => game to everybody
    CHANGE_COLOR: "change-color", //(color) => game to everybody
    REQUEST_SWITCH_COLOR: "request-switch-color", //request to owner, (response) => switch
    LOBBY_MODIFIED: "lobby-modified", // game to everybody

    ONLINE_STATE_CHANGED: "online-state-changed", //{localId, online} to everybody
}

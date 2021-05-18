import cookie from "cookie";

const getCookies = (socket) => {
    try {
        return cookie.parse(socket.handshake.headers.cookie);
    } catch (e) {
        console.log(e)
        return null
    }
}

const gameConfig = {
    maxPlayers: 4
}

export {getCookies, gameConfig}
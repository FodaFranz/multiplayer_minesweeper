var instance = null;

class Socket {
    constructor() {
        if (!instance) {
            instance = this;
        }

        this.io = io();
        return instance;
    }

    open() {
        this.io.on("error", (errorMsg) => {
            alert(errorMsg);
        });

        this.io.on("join", (roomId, playerName) => {
            location.href = "http://localhost:3000/rooms/"+roomId;
            localStorage.setItem("playerName", playerName);
        })
    }

    join(roomId, playerName) {
        console.log("join socket");
        this.io.emit("join", roomId, playerName);
    }
}

export default Socket;

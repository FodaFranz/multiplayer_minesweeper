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
            console.log("Error: " + errorMsg);
            location.href = "http://localhost:300/rooms";
        });

        this.io.on("join", (playerName, timestamp) => {
            console.log(timestamp + ": " + playerName + " joined.");
        });

        this.io.on("leave", (playerName, timestamp) => {
            console.log(timestamp + ": " + playerName + " left");
        })

        this.io.on("ready", (playerName) => {
            
        })
    }

    join(roomId, playerName) {
        console.log("join socket");
        this.io.emit("join", roomId, playerName);
    }

    leave(roomId, playerName) {
        console.log("leave socket");
        this.io.emit("leave", roomId, playerName);
    }

    ready(roomId, playerName) {
        this.io.emit("ready", roomId, playerName);
    }
}

export default Socket;

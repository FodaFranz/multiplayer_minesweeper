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

        this.io.on("join", (playerName, timestamp) => {
            console.log(timestamp + ": " + playerName + " joined.");
        });

        this.io.on("leave", (playerName, timestamp) => {
            console.log(timestamp + ": " + playerName + " left");
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
}

export default Socket;

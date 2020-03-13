import RoomDb from "../DAL/roomDbAccess";
import { CLIENT_RENEG_WINDOW } from "tls";

class RoomSocket {
    roomDb: RoomDb = new RoomDb();

    /*
        Connection gets established when client loads room-page
    */
    connect(io: any) {
        io.on("connection", (socket: any) => {
            console.log(`${socket.client.id} connected`);

            socket.on("join", (roomId: string, playerName: string) => {
                this.roomDb.join(socket.client.id, playerName, roomId)
                    .then(() => {   
                        socket.emit("join", new Date());
                        console.log(`${playerName} (${socket.client.id}) joined ${roomId}`)
                    })
                    .catch(err => {
                        console.log(err);
                        socket.emit("error", err.message);
                    });
            });

            socket.on("leave", (roomId: string) => {
                this.roomDb.removePlayer(roomId, socket.client.id)
                    .then(() => {
                        socket.emit("leave", new Date());
                        console.log(`${socket.client.id} left ${roomId}`)
                    })
                    .catch(err => {
                        console.log(err);
                        socket.emit("error", err.message);
                    })
            });

            socket.on("ready", (roomId: string) => {
                this.roomDb.ready(roomId, socket.client.id)
                    .then((isReady) => {
                        socket.emit("ready", new Date(), isReady);
                    });
            });

            socket.on("disconnect", () => {
                console.log(`${socket.client.id} disconnected`);
            });
        });
    }
}

export default RoomSocket;
import RoomDb from "../DAL/roomDbAccess";
import { CLIENT_RENEG_WINDOW, checkServerIdentity } from "tls";

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
                        socket.join(roomId);
                        io.to(roomId).emit("join", playerName, new Date());
                        console.log(`${playerName} (${socket.client.id}) joined ${roomId}`)
                    })
                    .catch(err => {
                        console.log(err);
                        socket.emit("error", err.message);
                    });
            });

            socket.on("leave", (roomId: string, playerName: String) => {
                this.roomDb.removePlayer(roomId, socket.client.id)
                    .then(() => {
                        io.to(roomId).emit("leave", new Date());
                        console.log(`${playerName} (${socket.client.id}) left ${roomId}`)
                    })
                    .catch(err => {
                        console.log(err);
                        socket.emit("error", err.message);
                    })
            });

            socket.on("ready", (roomId: string, playerName: string) => {
                this.roomDb.ready(roomId, socket.client.id)
                    .then(async (isReady) => {
                        socket.emit("ready", new Date(), isReady, playerName);
                        
                        //Start game if everyone is ready
                        if(await this.roomDb.checkReadyness(roomId)) {
                            console.log("start game");
                            io.to(roomId).emit("startGame");
                        }
                    });
            });

            socket.on("disconnect", () => {
                console.log(`${socket.client.id} disconnected`);
            });
        });
    }
}

export default RoomSocket;
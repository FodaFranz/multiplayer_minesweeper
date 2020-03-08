import RoomDb from "../DAL/roomDbAccess";

class RoomSocket {
    //Object to access the db
    roomDb: RoomDb = new RoomDb();

    //Gets called in page-load
    connect(io: any) {
        io.on("connection", (socket: any) => {
            console.log(`${socket.client.id} connected`);

            socket.on("join", (roomId: string, playerName: string) => {
                this.roomDb.join(socket.client.id, playerName, roomId)
                    .then(result => {
                        if(result == true) {
                            socket.join(roomId);
                            console.log(`${socket.client.id} joined ${roomId}`);
                        }
                        else {
                            socket.emit("error", "Room is full");
                        }
                    })
                    .catch(err => console.log(err));
            });

            socket.on("leave", (roomId: string, playerName: string) => {
                
            });

            socket.on("ready", (roomId: string, playerName: string) => {
            })

            socket.on("disconnect", () => {
                console.log(`${socket.client.id} disconnected`);
            });
        });
    }
}

export default RoomSocket;
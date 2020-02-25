import RoomDb from "../DAL/roomDbAccess";

class RoomSocket {
    //Object to access the db
    roomDb: RoomDb = new RoomDb();

    //Gets called in page-load
    connect(io: any) {
        io.on("connection", (socket: any) => {
            console.log("user connected");

            //Player joins room
            socket.on("join", (id: string, playerName: string) => {
                //Join database-room and check if slot is free
                this.roomDb.join(playerName, id)
                    .then(result => {
                        if(result == true) {
                            socket.join(id);
                            console.log(`${playerName} joined ${id}`);
                            //Broadcast to all room-members
                            io.to(id).emit("join", playerName, new Date());
                        }
                        else {
                            //TODO
                            socket.emit("error", "Could not join room");
                            console.log("Could not join room");
                        }
                    })
                    .catch(err => console.log(err));
            });

            socket.on("leave", (id: string, playerName: string) => {
                //TODO:
                this.roomDb.removePlayer(id, playerName)
                    .then(result => {
                        if(result.nModified == 1) {
                            socket.leave(id);
                        }
                        else {
                            socket.emit("error", "Could not remove player from room");
                            console.log("Could not remove player from room");
                        }
                    })
            })

            //User closes site
            socket.on("disconnect", () => {
                //Disconnect player
                //Change admin of room when admin leaves
                console.log("disconnect");
            });
        });
    }
}

export default RoomSocket;
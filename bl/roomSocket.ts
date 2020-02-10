import RoomDb from "../DAL/roomDbAccess";

class RoomSocket {
    //Object to access the db
    roomDb: RoomDb = new RoomDb();

    //Runs when user opens xxx/rooms
    connect(io: any) {
        io.on("connection", (socket: any) => {
            console.log("user connected");

            //User creates room and automatically joins it
            socket.on("create", (name: string, creatorName: string, maxPlayers: Number) => {
                //Create room inside mongodb
                this.roomDb.create(name, creatorName, maxPlayers)
                    .then(room => {
                        //Create room inside socket
                        socket.join(room._id);
                        console.log(`${room.players[0]} created ${room.name} (${room._id})`);
                    })
                    .catch(err => {
                        //TODO: figure out what to do when an error happens
                        console.log(err);
                    });
            });

            //Player joins room
            socket.on("join", (id: string, username: string) => {
                //Join database-room and check if slot is free
                this.roomDb.join(username, id)
                    .then(result => {
                        socket.join(id);
                        console.log(`${username} joined ${id}`);
                        //Send message to client to join
                    })
                    .catch(err => console.log(err));
            });

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
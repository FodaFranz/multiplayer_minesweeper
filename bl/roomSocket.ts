import RoomDb from "../DAL/roomDbAccess";

class RoomSocket {
    //Object to access the db
    roomDb: RoomDb = new RoomDb();

    //Gets called in page-load
    connect(io: any) {
        io.on("connection", (socket: any) => {
            console.log("user connected");

            //Player joins room
            socket.on("join", (roomId: string, playerName: string) => {
                socket.join(roomId);
                console.log(`${playerName} joined ${roomId}`);
                //Broadcast to all room-members
                io.to(roomId).emit("join", playerName, new Date());
            });

            socket.on("leave", (roomId: string, playerName: string) => {
                socket.leave(roomId);
                io.to(roomId).emit("leave", playerName, new Date());
            })

            //User closes site, room already left when disconnect is fired
            socket.on("disconnect", () => {
                //Disconnect player
                //Change admin of room when admin leaves
                console.log("disconnect");
            });
        });
    }
}

export default RoomSocket;
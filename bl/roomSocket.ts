import RoomDb from "../DAL/roomDbAccess";
import { userInfo } from "os";

class RoomSocket {
    //Object to access the db
    roomDb: RoomDb = new RoomDb();

    //Runs when user opens xxx/rooms
    connect(io: any) {
        io.on("connection", (socket:any) => {
            console.log("user connected");

            //User creates room and automatically joins it
            socket.on("create", (name: string, creatorName: string, maxPlayers: Number) => {
                //Create room inside mongodb
                this.roomDb.create(name, creatorName, maxPlayers)
                    .then(room => {
                        //Create room inside socket
                        socket.join(room._id);
                        console.log(creatorName + " created " + room.name);
                    })
                    .catch(err => {
                        //TODO: figure out what to do when an error happens
                        console.log(err);
                    });
            });

            //Player joins room
            socket.on("join", (id: string, username: string) => {

                console.log("JOIN DER BOI " + id + " " + username);
            });

            //User closes site
            socket.on("disconnect", () => {
                console.log("disconnect");
            });      
        });
    }
}

export default RoomSocket;
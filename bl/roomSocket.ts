import RoomDb from "../DAL/roomDbAccess";
import Game from "../bl/game";
import room, { IGameDimensions } from "../models/room";

class RoomSocket {
    roomDb: RoomDb = new RoomDb();
    game: Game = new Game(0,0,0,"");

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
                            try {
                                const gd: IGameDimensions = await this.roomDb.getGameDimensions(roomId);
                                this.game = new Game(gd.height, gd.width, gd.mines, roomId);
                                this.game.createField();
                                io.to(roomId).emit("startGame", new Date(), this.game.field);
                            }
                            catch(err) {
                                console.log(err);
                            }
                        }
                    });
            });

            socket.on("checkField", (roomId: String, playerName: String, x: number, y:number) => {
                let retVal: number = this.game!.check(x,y,playerName);
                if(retVal == 1) {
                    io.to(roomId).emit("win", new Date());
                }
                else if(retVal == -1) {
                    io.to(roomId).emit("loose", new Date(), playerName);
                }
                else if(retVal == 0) {
                    io.to(roomId).emit("newMove", new Date(), this.game!.field, this.game!.openField, playerName);
                }
            });

            socket.on("flag", (roomId: String, playerName: String, x: number, y:number) => {
                this.game!.flag(x,y);
                io.to(roomId).emit("newMove", new Date(), this.game!.field, this.game!.openField, playerName);
            })

            socket.on("disconnect", () => {
                console.log(`${socket.client.id} disconnected`);
            });
        });
    }
}

export default RoomSocket;
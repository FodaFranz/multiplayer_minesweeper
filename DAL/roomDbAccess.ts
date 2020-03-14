import Room, { IRoom, IPlayer, IGameDimensions } from "../models/room";
import State from "../util/state";
import RoomSocket from "../bl/roomSocket";
import room from "../models/room";

class RoomDbAccess {
    get(): Promise<[IRoom]> {
        return new Promise<[IRoom]>((resolve, reject) => {
            Room.find((err: Error, rooms: [IRoom]) => {
                if (err)
                    reject(err);
                else
                    resolve(rooms);
            });
        });
    }

    create(name: string, maxPlayers: Number, height: Number, width: Number, mines: Number): Promise<IRoom> {
        return new Promise<IRoom>((resolve, reject) => {
            try {
                const room: IRoom = new Room({
                    creationTime: new Date(),
                    name: name,
                    maxPlayers: maxPlayers,
                    players: [],
                    state: State.waiting,
                    gameDimensions: {
                        height: height,
                        width: width,
                        mines: mines
                    }
                });

                room.save((err: Error, room: IRoom) => {
                    if (err)
                        reject(err);
                    else
                        resolve(room);
                });
            }
            catch (error) {
                reject(error);
            }
        })
    }

    join(clientId: String, playerName: String, roomId: String): Promise<any> {
        const checkSlot = new Promise<Boolean>((resolve, reject) => {
            Room.findById(roomId, "players maxPlayers", (err: Error, result: any) => {
                if (err) reject(err);

                if (result.players.length < result.maxPlayers) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });

        return new Promise((resolve, reject) => {
            checkSlot.then(result => {
                if (result) {
                    Room.updateOne({ _id: roomId },
                        { $push: { players: { clientId: clientId, name: playerName, isReady: false } } },
                        (err: Error, result: any) => {
                            if(err) 
                                reject(err);

                            if(result.nModified == 1) 
                                resolve(); 
                            else 
                                reject(new Error("Error updating db"));
                        });
                }
                else {
                    reject(new Error("Room full"));
                }
            })
        });
    }

    ready(roomId: string, clientId: string): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            let readyOrUnready: Boolean = true;
            Room.findById(roomId, async (err: Error, room: IRoom) => {
                if(err) reject(err);

                readyOrUnready = room.players.find(x => x.clientId == clientId)!.isReady;
                room.players.find(x => x.clientId == clientId)!.isReady = !readyOrUnready;
                room.markModified("players");
                await room.save((err) => reject(err));
                resolve(!readyOrUnready);
            });
        });
    }

    removePlayer(roomId: string, clientId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            Room.updateOne({ _id: roomId },
                { $pull: { players: { clientId: clientId } } },
                async (err: Error, result: any) => {
                    if (err) reject(err);

                    if(result.nModified == 1) {
                        //Check if room is empty
                        try {
                            await this.checkRoom(roomId);
                        }
                        catch(err) {
                            reject(err);
                        }                
                        
                        resolve();
                    }
                    else
                        reject(new Error("Error removing player from db"));
                })
        });
    }

    checkReadyness(roomId: String): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            Room.findById(roomId, async (err: Error, result: any) => {
                if (err) reject(err);

                const players = result.players as [IPlayer];
                await players.forEach(player => {
                    if(player.isReady == false)
                        resolve(false);
                })

                if(players.length == result.maxPlayers) {
                    //Update state
                    await this.updateState(roomId);
                    resolve(true);
                }
                else 
                    resolve(false);
            });
        });
    }

    getGameDimensions(roomId: String): Promise<IGameDimensions> {
        return new Promise<IGameDimensions>((resolve, reject) => {
            Room.findById(roomId, (err: Error, room: IRoom) => {
                if(err) reject(err);

                resolve(room.gameDimensions);
            });
        })
    }

    //Flips the state
    updateState(roomId: String): Promise<any> {
        return new Promise((resolve, reject) => {
            Room.findById(roomId, async (err: Error, room: IRoom) => {
                if(err) reject(err);

                if(room.state = State.waiting) 
                    room.state = State.playing;
                else
                    room.state = State.waiting;

                room.markModified("state");
                await room.save(err => reject(err));
                resolve();
            })
        });
    }

    //Checks if the room is empty
    checkRoom(roomId: String): Promise<any> {
        return new Promise((resolve, reject) => {
            Room.findOne({ _id: roomId }, "players", async (err: Error, players: any) => {
                if(err) reject(err);
    
                if(players.players.length == 0) {
                    await Room.deleteOne({ _id: roomId });
                    resolve();
                }
            })
        })
    }

    getIdOfName(name: String): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            Room.findOne({ name: name }, "_id", (err: Error, id: String) => {
                if (err)
                    reject(err);
                else
                    resolve(id);
            })
        });
    }
}

export default RoomDbAccess;
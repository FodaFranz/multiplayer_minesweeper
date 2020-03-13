import Room, { IRoom } from "../models/room";
import State from "../util/state";

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

    create(name: string, maxPlayers: Number): Promise<IRoom> {
        return new Promise<IRoom>((resolve, reject) => {
            try {
                const room: IRoom = new Room({
                    creationTime: new Date(),
                    name: name,
                    maxPlayers: maxPlayers,
                    players: [],
                    state: State.waiting
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

    //rework join
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
        return new Promise<Boolean>((resolve, reject) => {
            Room.updateOne({ _id: roomId, "players.clientId": clientId },
                {
                    $set: {
                        "players.$.ready": true
                    }
                },
                (err: Error, result: any) => {
                    if(err) reject(err);

                    if(result.nModified == 1)
                        resolve(true);
                    else
                        resolve(false);
                })
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
                        await this.checkRoom(roomId);
                        resolve();
                    }
                    else
                        reject(new Error("Error removing player from db"));
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
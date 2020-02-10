import mongoose , { mongo } from "mongoose";
import Room, { IRoom } from "../models/room";
import State from "../util/state";

class RoomDbAccess {
    //Creates room in mongodb and returns the room-object if insertion has been successfull
    create(name: string, creatorName: string, maxPlayers: Number): Promise<IRoom> {
        return new Promise<IRoom>((resolve, reject) => {
            try {
                const room: IRoom = new Room({
                    _id: mongoose.Types.ObjectId(),
                    _creationTime: new Date(),
                    name: name,
                    maxPlayers: maxPlayers,
                    players: [creatorName],
                    state: State.waiting
                });

                //Save room to mongodb-Databse
                room.save((err: Error, room: IRoom) => {
                    if(err) 
                        reject(err);
                    else
                        resolve(room);
                });
            }
            catch(error) {
                reject(error);
            }
        })
    }

    //Returns all rooms
    get(): Promise<[IRoom]> {
        return new Promise<[IRoom]>((resolve, reject) => {
            Room.find((err: Error, rooms: [IRoom]) => {
                if(err)
                    reject(err);
                else
                    resolve(rooms);
            });
        });
    }

    join(playerName: String, roomId: String): Promise<IRoom> {
        //Checks if room has a player-slot left
        const checkSlot = new Promise<Boolean>((resolve, reject) => {
            Room.findById(roomId, "players maxPlayers", (err: Error, result: any) => {
                if(err) reject(err);

                if(result.players.length < result.maxPlayers) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });

        return new Promise((resolve, reject) => {
            //Check if room has space
            checkSlot.then(isSlotLeft => {
                if(isSlotLeft) {
                    //Update player-list inside db
                    Room.update({ _id: roomId }, 
                        { $addToSet: { players:  playerName} },
                        (err: Error, result: any) => {
                            if(err) reject(err);

                            resolve(result);
                        });
                }
                else {
                    reject(new Error("Room is full"));
                }
            })
        });
    }

    getIdOfName(name: String): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            Room.findOne({name: name}, "_id", (err: Error, id: String) => {
                if(err)
                    reject(err);
                else
                    resolve(id);
            })
        });
    }
} 

export default RoomDbAccess;
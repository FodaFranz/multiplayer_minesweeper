import mongoose , { mongo } from "mongoose";
import Room, { IRoom } from "../models/room";

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
                    players: [creatorName]
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

    getIdOfName(name: String): Promise<String> {
        return new Promise<String>((resolve, reject) => {
            Room.find({name: name}, "_id", (err: Error, id: String) => {
                if(err)
                    reject(err);
                else
                    resolve(id);
            })
        });
    }
} 

export default RoomDbAccess;
import mongoose, { Schema } from "mongoose";

export interface IRoom extends mongoose.Document {
    _id: String;
    _creationTime: Date;
    name: String;
    maxPlayers: Number;
    players: [String];
}

const roomSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _creationTime: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    maxPlayers: {
        type: Number,
        required: true
    },
    players: [{
        type: String,
    }]
})

export default mongoose.model<IRoom>("Room", roomSchema);
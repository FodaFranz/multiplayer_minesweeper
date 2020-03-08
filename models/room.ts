import mongoose, { Schema } from "mongoose";

export interface IRoom extends mongoose.Document {
    creationTime: Date;
    name: String;
    maxPlayers: Number;
    players: [Object];
    state: String;
}

const playerSchema = new Schema({
    clientId: {
        type: String
    },
    name: {
        type: String,
    },
    isReady: {
        type: Boolean,
        default: false
    }
});

const roomSchema = new Schema({
    creationTime: {
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
        type: playerSchema,
    }],
    state: {
        type: String,
        enum: [ "playing", "waiting" ],
        default: "waiting"
    }
});

export default mongoose.model<IRoom>("Room", roomSchema);
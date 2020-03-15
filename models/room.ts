import mongoose, { Schema } from "mongoose";


export interface IPlayer extends mongoose.Document {
    clientId: String;
    name: String;
    isReady: Boolean;
}

export interface IGameDimensions extends mongoose.Document {
    width: number;
    height: number;
    mines: number;
}

export interface IRoom extends mongoose.Document {
    creationTime: Date;
    name: String;
    maxPlayers: Number;
    players: [IPlayer];
    state: String;
    gameDimensions: IGameDimensions;
}

const playerSchema = new Schema({
    clientId: {
        type: String
    },
    name: {
        type: String
    },
    isReady: {
        type: Boolean,
        default: false
    }
});

const gameDimensions = new Schema({
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    mines: {
        type: Number
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
        type: playerSchema
    }],
    state: {
        type: String,
        enum: [ "playing", "waiting" ],
        default: "waiting"
    },
    gameDimensions: {
        type: gameDimensions
    }
});

export default mongoose.model<IRoom>("Room", roomSchema);
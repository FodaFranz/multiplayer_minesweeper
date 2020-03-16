"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var playerSchema = new mongoose_1.Schema({
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
var gameDimensions = new mongoose_1.Schema({
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
var roomSchema = new mongoose_1.Schema({
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
        enum: ["playing", "waiting"],
        default: "waiting"
    },
    gameDimensions: {
        type: gameDimensions
    }
});
exports.default = mongoose_1.default.model("Room", roomSchema);
//# sourceMappingURL=room.js.map
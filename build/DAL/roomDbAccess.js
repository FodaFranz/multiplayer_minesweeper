"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var room_1 = __importDefault(require("../models/room"));
var state_1 = __importDefault(require("../util/state"));
var RoomDbAccess = /** @class */ (function () {
    function RoomDbAccess() {
    }
    RoomDbAccess.prototype.get = function () {
        return new Promise(function (resolve, reject) {
            room_1.default.find(function (err, rooms) {
                if (err)
                    reject(err);
                else
                    resolve(rooms);
            });
        });
    };
    RoomDbAccess.prototype.create = function (name, maxPlayers, height, width, mines) {
        return new Promise(function (resolve, reject) {
            try {
                var room_2 = new room_1.default({
                    creationTime: new Date(),
                    name: name,
                    maxPlayers: maxPlayers,
                    players: [],
                    state: state_1.default.waiting,
                    gameDimensions: {
                        height: height,
                        width: width,
                        mines: mines
                    }
                });
                room_2.save(function (err, room) {
                    if (err)
                        reject(err);
                    else
                        resolve(room);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    };
    RoomDbAccess.prototype.join = function (clientId, playerName, roomId) {
        var checkSlot = new Promise(function (resolve, reject) {
            room_1.default.findById(roomId, "players maxPlayers", function (err, result) {
                if (err)
                    reject(err);
                if (result.players.length < result.maxPlayers) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
        return new Promise(function (resolve, reject) {
            checkSlot.then(function (result) {
                if (result) {
                    room_1.default.updateOne({ _id: roomId }, { $push: { players: { clientId: clientId, name: playerName, isReady: false } } }, function (err, result) {
                        if (err)
                            reject(err);
                        if (result.nModified == 1)
                            resolve();
                        else
                            reject(new Error("Error updating db"));
                    });
                }
                else {
                    reject(new Error("Room full"));
                }
            });
        });
    };
    RoomDbAccess.prototype.ready = function (roomId, clientId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var readyOrUnready = true;
            room_1.default.findById(roomId, function (err, room) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                reject(err);
                            readyOrUnready = room.players.find(function (x) { return x.clientId == clientId; }).isReady;
                            room.players.find(function (x) { return x.clientId == clientId; }).isReady = !readyOrUnready;
                            room.markModified("players");
                            return [4 /*yield*/, room.save(function (err) { return reject(err); })];
                        case 1:
                            _a.sent();
                            resolve(!readyOrUnready);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    RoomDbAccess.prototype.removePlayer = function (roomId, clientId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            room_1.default.updateOne({ _id: roomId }, { $pull: { players: { clientId: clientId } } }, function (err, result) { return __awaiter(_this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                reject(err);
                            if (!(result.nModified == 1)) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.checkRoom(roomId)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            reject(err_1);
                            return [3 /*break*/, 4];
                        case 4:
                            resolve();
                            return [3 /*break*/, 6];
                        case 5:
                            reject(new Error("Error removing player from db"));
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    RoomDbAccess.prototype.checkReadyness = function (roomId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            room_1.default.findById(roomId, function (err, result) { return __awaiter(_this, void 0, void 0, function () {
                var players;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                reject(err);
                            players = result.players;
                            return [4 /*yield*/, players.forEach(function (player) {
                                    if (player.isReady == false)
                                        resolve(false);
                                })];
                        case 1:
                            _a.sent();
                            if (!(players.length == result.maxPlayers)) return [3 /*break*/, 3];
                            //Update state
                            return [4 /*yield*/, this.updateState(roomId)];
                        case 2:
                            //Update state
                            _a.sent();
                            resolve(true);
                            return [3 /*break*/, 4];
                        case 3:
                            resolve(false);
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    RoomDbAccess.prototype.getGameDimensions = function (roomId) {
        return new Promise(function (resolve, reject) {
            room_1.default.findById(roomId, function (err, room) {
                if (err)
                    reject(err);
                resolve(room.gameDimensions);
            });
        });
    };
    //Flips the state
    RoomDbAccess.prototype.updateState = function (roomId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            room_1.default.findById(roomId, function (err, room) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                reject(err);
                            if (room.state = state_1.default.waiting)
                                room.state = state_1.default.playing;
                            else
                                room.state = state_1.default.waiting;
                            room.markModified("state");
                            return [4 /*yield*/, room.save(function (err) { return reject(err); })];
                        case 1:
                            _a.sent();
                            resolve();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    //Checks if the room is empty
    RoomDbAccess.prototype.checkRoom = function (roomId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            room_1.default.findOne({ _id: roomId }, "players", function (err, players) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (err)
                                reject(err);
                            if (!(players.players.length == 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, room_1.default.deleteOne({ _id: roomId })];
                        case 1:
                            _a.sent();
                            resolve();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    RoomDbAccess.prototype.getIdOfName = function (name) {
        return new Promise(function (resolve, reject) {
            room_1.default.findOne({ name: name }, "_id", function (err, id) {
                if (err)
                    reject(err);
                else
                    resolve(id);
            });
        });
    };
    return RoomDbAccess;
}());
exports.default = RoomDbAccess;
//# sourceMappingURL=roomDbAccess.js.map
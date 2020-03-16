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
var roomDbAccess_1 = __importDefault(require("../DAL/roomDbAccess"));
var game_1 = __importDefault(require("../bl/game"));
var RoomSocket = /** @class */ (function () {
    function RoomSocket() {
        this.roomDb = new roomDbAccess_1.default();
        this.game = new game_1.default(0, 0, 0, "");
    }
    /*
        Connection gets established when client loads room-page
    */
    RoomSocket.prototype.connect = function (io) {
        var _this = this;
        io.on("connection", function (socket) {
            console.log(socket.client.id + " connected");
            socket.on("join", function (roomId, playerName) {
                _this.roomDb.join(socket.client.id, playerName, roomId)
                    .then(function () {
                    socket.join(roomId);
                    io.to(roomId).emit("join", playerName, new Date());
                    console.log(playerName + " (" + socket.client.id + ") joined " + roomId);
                })
                    .catch(function (err) {
                    console.log(err);
                    socket.emit("error", err.message);
                });
            });
            socket.on("leave", function (roomId, playerName) {
                _this.roomDb.removePlayer(roomId, socket.client.id)
                    .then(function () {
                    io.to(roomId).emit("leave", new Date());
                    console.log(playerName + " (" + socket.client.id + ") left " + roomId);
                })
                    .catch(function (err) {
                    console.log(err);
                    socket.emit("error", err.message);
                });
            });
            socket.on("ready", function (roomId, playerName) {
                _this.roomDb.ready(roomId, socket.client.id)
                    .then(function (isReady) { return __awaiter(_this, void 0, void 0, function () {
                    var gd, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                socket.emit("ready", new Date(), isReady, playerName);
                                return [4 /*yield*/, this.roomDb.checkReadyness(roomId)];
                            case 1:
                                if (!_a.sent()) return [3 /*break*/, 5];
                                console.log("start game");
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, this.roomDb.getGameDimensions(roomId)];
                            case 3:
                                gd = _a.sent();
                                this.game = new game_1.default(gd.height, gd.width, gd.mines, roomId);
                                this.game.createField();
                                io.to(roomId).emit("startGame", new Date(), this.game.field);
                                return [3 /*break*/, 5];
                            case 4:
                                err_1 = _a.sent();
                                console.log(err_1);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
            });
            socket.on("checkField", function (roomId, playerName, x, y) {
                var retVal = _this.game.check(x, y, playerName);
                if (retVal == 1) {
                    io.to(roomId).emit("win", new Date());
                }
                else if (retVal == -1) {
                    io.to(roomId).emit("loose", new Date(), playerName);
                }
                else if (retVal == 0) {
                    io.to(roomId).emit("newMove", new Date(), _this.game.field, _this.game.openField, playerName);
                }
            });
            socket.on("flag", function (roomId, playerName, x, y) {
                _this.game.flag(x, y);
                io.to(roomId).emit("newMove", new Date(), _this.game.field, _this.game.openField, playerName);
            });
            socket.on("disconnect", function () {
                console.log(socket.client.id + " disconnected");
            });
        });
    };
    return RoomSocket;
}());
exports.default = RoomSocket;
//# sourceMappingURL=roomSocket.js.map
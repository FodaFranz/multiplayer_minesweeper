"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var roomSocket_1 = __importDefault(require("../bl/roomSocket"));
var roomDbAccess_1 = __importDefault(require("../DAL/roomDbAccess"));
var router = express_1.default.Router();
var roomSocket = new roomSocket_1.default();
var roomDb = new roomDbAccess_1.default();
router.get("/", function (req, res) {
    var io = res.locals["socketio"];
    roomSocket.connect(io);
    res.sendFile("./lobby.html", { root: "public" });
});
router.get("/all", function (req, res) {
    roomDb.get()
        .then(function (rooms) { return res.status(200).json(rooms); })
        .catch(function (err) {
        console.log(err);
    });
});
router.post("/leave", function (req, res) {
});
router.post("/create", function (req, res) {
    roomDb.create(req.body.roomName, req.body.maxPlayers, req.body.height, req.body.width, req.body.mines)
        .then(function (room) { return res.status(200).send(room._id); })
        .catch(function (error) {
        console.log(error);
        res.status(500).send(error.message);
    });
});
router.post("/ready", function (req, res) {
});
router.get("/:id", function (req, res) {
    res.sendFile("./room.html", { root: "public" });
});
module.exports = router;
//# sourceMappingURL=roomRoutes.js.map
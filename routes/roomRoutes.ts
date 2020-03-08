import express, { Router } from "express";

import RoomSocket from "../bl/roomSocket";
import RoomDbAccess from "../DAL/roomDbAccess";

const router: Router = express.Router();
const roomSocket: RoomSocket = new RoomSocket();
const roomDb: RoomDbAccess = new RoomDbAccess();

router.get("/", (req: express.Request, res: express.Response) => {
    const io = res.locals["socketio"];
    roomSocket.connect(io);

    res.sendFile("./lobby.html", { root: "public" });
});

router.get("/all", (req: express.Request, res: express.Response) => {
    roomDb.get()
        .then(rooms => res.status(200).json(rooms))
        .catch(err => {
            console.log(err);
        })
});

router.post("/leave", (req: express.Request, res: express.Response) => {

});

router.post("/create", (req: express.Request, res: express.Response) => {
    roomDb.create(req.body.roomName, req.body.maxPlayers)
        .then(room => res.status(200).send(room._id))
        .catch(error => res.status(500).send(error.message));
});

//Ready and unready -> same route
router.post("/ready", (req: express.Request, res: express.Response) => {

});

router.get("/:id", (req: express.Request, res: express.Response) => {
    res.sendFile("./room.html", { root: "public" });
});

export = router;
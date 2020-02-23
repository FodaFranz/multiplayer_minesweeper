import express, { Router } from "express";

import RoomSocket from "../bl/roomSocket";
import RoomDbAccess from "../DAL/roomDbAccess";

const router: Router = express.Router();
const roomSocket: RoomSocket = new RoomSocket();
const roomDbAccess: RoomDbAccess = new RoomDbAccess();

router.get("/", (req: express.Request, res: express.Response) => {
    const io = res.locals["socketio"];
    roomSocket.connect(io);

    res.sendFile("./lobby.html", { root: "public" });
});

router.get("/all", (req: express.Request, res: express.Response) => {
    roomDbAccess.get()
        .then(rooms => res.status(200).json(rooms))
        .catch(err => {
            console.log(err);
        })
});

router.post("/create", (req: express.Request, res: express.Response) => {
    roomDbAccess.create(req.body.roomName, req.body.playerName, req.body.maxPlayers)
        .then(room => {
            console.log(room);
            res.status(200).json(room.id);
        });
})

router.get("/:id", (req: express.Request, res: express.Response) => {
    res.sendFile("./room.html", { root: "public" });
});

export = router;
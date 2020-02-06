import express, { Router } from "express";
import RoomSocket from "../bl/roomSocket";
import RoomDbAccess from "../DAL/roomDbAccess";

const router: Router = express.Router();
const roomSocket: RoomSocket = new RoomSocket();
const roomDbAccess: RoomDbAccess = new RoomDbAccess();

router.get("/", (req: express.Request, res: express.Response) => {
    const io = res.locals["socketio"];
    roomSocket.connect(io);

    res.sendFile("./rooms.html", { root: "public" });
});

router.get("/all", (req: express.Request, res: express.Response) => {
    roomDbAccess.get()
        .then(rooms => res.status(200).json(rooms))
        .catch(err => {
            console.log(err);
        })
});

//Used to deliver the id after creating a room
router.get("/getRoomIdOfName/:name", (req: express.Request, res: express.Response) => {
    roomDbAccess.getIdOfName(req.params.name)
        .then(id => res.status(200).send(id))
        .catch(err => console.log(err));
});

export = router;
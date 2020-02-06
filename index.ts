import express from "express";
import mongoose, { mongo } from "mongoose";
import * as socketio from "socket.io";

import dbConfig from "./config/db.json";
import webConfig from "./config/web.json";

import roomRoutes from "./routes/roomRoutes";

const app = express();
app.set("port", 3000);

let http = require("http").Server(app);
let io = require("socket.io")(http);

app.use(express.static('public'));

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true
});

//Share io with routes
app.use((req, res, next) => {
    res.locals["socketio"] = io;
    next();
});

app.use("/rooms", roomRoutes);

const server = http.listen(3000, function() {
    console.log("listening on *:3000");
});
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var db_json_1 = __importDefault(require("./config/db.json"));
var web_json_1 = __importDefault(require("./config/web.json"));
var roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
var app = express_1.default();
app.set("port", web_json_1.default.port);
var http = require("http").Server(app);
var io = require("socket.io")(http);
//To access request-body
app.use(express_1.default.urlencoded());
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
mongoose_1.default.connect(db_json_1.default.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true
});
//Share io with routes
app.use(function (req, res, next) {
    res.locals["socketio"] = io;
    next();
});
app.use("/rooms", roomRoutes_1.default);
var server = http.listen(3000, function () {
    console.log("listening on *:3000");
});
//# sourceMappingURL=index.js.map
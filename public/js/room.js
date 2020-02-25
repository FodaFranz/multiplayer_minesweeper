import Socket from "./socket.js";

let _id = "";
let _playerName = "";

//Handles every socket-event
const socket = new Socket();

$(() => {
    //Initialize _id with the id of the room when html page is loaded
    let splittedUrl = window.location.href.split("/");
    _id = splittedUrl[splittedUrl.length - 1];
    _playerName = localStorage.getItem("playerName");

    //Join the socket-room
    socket.open();
    socket.join(_id, _playerName);
});

function leave() {
    console.log("leave");
}
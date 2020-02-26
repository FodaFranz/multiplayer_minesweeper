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

$('#btnLeave').click(() => {
    console.log("leave");
    fetch("http://localhost:3000/rooms/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: _id, playerName: _playerName })
    })
    .then(res => {
        return res.json();
    })
    .then(resJson => {
        if(resJson == true) {
            location.href = "http://localhost:3000/rooms";
            socket.leave(_roomId, _playerName);
        }
        else
            alert(resJson);
    })
    .catch(err => alert(err));
})
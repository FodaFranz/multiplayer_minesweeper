let _id = "";
let _playerName = "";

const socket = io();

$(() => {
    let splittedUrl = window.location.href.split("/");
    _id = splittedUrl[splittedUrl.length - 1];
    _playerName = localStorage.getItem("playerName");

    socket.emit("join", _id, _playerName);
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
            console.log(resJson);
    })
    .catch(err => alert(err));
});

$("#btnReady").click(() => {
    fetch("http://localhost:3000/rooms/ready", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: _roomId, playerName: _playerName })
    })
    .then(res => {
        return res.json()
    })
    .then(resJson => {
        if(resJson == true) {
            socket.ready(roomId, playerName);
        }
    })
})

socket.on("error", (errorMsg) => {
    alert(errorMsg);
    location.href = "http://localhost:300/rooms";
});

socket.on("join", (playerName, timestamp) => {
    console.log(timestamp + ": " + playerName + " joined.");
});

socket.on("leave", (playerName, timestamp) => {
    console.log(timestamp + ": " + playerName + " left");
})

socket.on("ready", (playerName) => {
    
})
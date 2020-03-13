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
    socket.emit("leave", _id);
});

$("#btnReady").click(() => {
    socket.emit("ready", _id);
});


socket.on("error", (errorMsg) => {
    alert(errorMsg);
    location.href = "http://localhost:3000/rooms";
});

socket.on("join", (timestamp) => {
    console.log(timestamp + ": " + _playerName + " joined.");
});

socket.on("leave", (timestamp) => {
    console.log(timestamp + ": " + _playerName + " left");
    location.href = "http://localhost:3000/rooms";
})

socket.on("ready", (timestamp, isReady) => {
    console.log(timestamp + ": " + _playerName + " " + isReady);

})
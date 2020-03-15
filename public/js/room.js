let _id = "";
let _playerName = "";

let currentPlayers = 0;
let startTime = 0;

const socket = io();

$(() => {
    let splittedUrl = window.location.href.split("/");
    _id = splittedUrl[splittedUrl.length - 1];
    _playerName = localStorage.getItem("playerName");

    socket.emit("join", _id, _playerName);
});

$('#btnLeave').click(() => {
    socket.emit("leave", _id, _playerName);
});

$("#btnReady").click(() => {
    socket.emit("ready", _id, _playerName);
});

socket.on("error", (errorMsg) => {
    alert(errorMsg);
    location.href = "http://localhost:3000/rooms";
});

socket.on("join", (playerName, timestamp) => {
    console.log(timestamp + ": " + playerName + " joined.");
});

socket.on("leave", (timestamp) => {
    console.log(timestamp + ": " + _playerName + " left");
    location.href = "http://localhost:3000/rooms";
});

socket.on("ready", (timestamp, isReady, playerName) => {
    console.log(timestamp + ": " + playerName + " " + isReady);
});

socket.on("newMove", (timestamp, field, openField, playerName) => {
    console.log("NEW MOVE MY DUDE");
});

socket.on("win", (timestamp) => {
    //Vicory
});

socket.on("loose", (timestamp) => {
    //Loose
});

socket.on("startGame", (timestamp, field) => {
    console.log(field);
    startTime = timestamp;

    let div = document.getElementById("divGame")
    for(let i = 0;i < field.length;i++) {
        for(let j = 0;j < field[i].length; j++) {
            let button = document.createElement("input");
            button.type = "button";
            button.name = j+","+i;
            button.width=20;
            button.height=20;
            button.onclick = () =>  {
                checkField(j,i);
            }

            div.appendChild(button);
        }
        div.appendChild(document.createElement("br"));
    }
});

function checkField(x,y) {
    socket.emit("checkField", _id, _playerName, x,y);
}


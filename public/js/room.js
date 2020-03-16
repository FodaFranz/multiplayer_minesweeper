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
    console.log("\n");
    displayField(openField);
    updateField(field, openField);
});

socket.on("win", (timestamp) => {
    alert("VICTORY");
    console.log(timestamp - startTime);
});

socket.on("loose", (timestamp, playerName) => {
    alert(playerName + " messed up, you lost");
    console.log(timestamp - startTime);
});

socket.on("startGame", (timestamp, field) => {
    displayField(field);
    startTime = timestamp;

    let div = document.getElementById("divGame")
    for(let i = 0;i < field.length;i++) {
        for(let j = 0;j < field[i].length; j++) {
            let button = document.createElement("input");
            button.type = "button";
            button.setAttribute("id", j+","+i);
            button.width=20;
            button.height=20;
            button.onclick = () =>  {
                checkField(j,i);
            }

            button.addEventListener("contextmenu", (ev) => {
                ev.preventDefault();
                flag(j,i);
                return false;
            }, false);

            div.appendChild(button);
        }
        div.appendChild(document.createElement("br"));
    }
});

function displayField(field) {
    let line = ""
    for(let i = 0;i < field.length;i++) {
        for(let j = 0;j < field[i].length; j++) {
            line += field[i][j] + " ";
        }
        console.log(line);
        line = "";
    }
}

function updateField(field, openField) {
    for(let i = 0;i < openField.length;i++) {
        for(let j = 0;j < openField[i].length; j++) {
            if(openField[i][j] == 1) {
                console.log(field[i][j]);
                document.getElementById(j+","+i).value = field[i][j];
                //Change to background color change
                document.getElementById(j+","+i).disabled = true;
            }
            else if (openField[i][j] == 2) {
                document.getElementById(j+","+i).value = "f";
            }
            else {
                document.getElementById(j+","+i).value = "";
            }
        }
    }
}

function flag(x,y) {
    if(document.getElementById(x+","+y).value == "" || document.getElementById(x+","+y).value == "f")
        socket.emit("flag", _id, _playerName, x,y);
}

function checkField(x,y) {
    if(document.getElementById(x+","+y).value == "")
        socket.emit("checkField", _id, _playerName, x,y);
}


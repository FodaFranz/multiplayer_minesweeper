import Socket from "./socket.js";

//Handles every socket-event
const socket = new Socket();

$(() => {
    getRooms()
        .then(rooms => displayRooms(rooms))
        .catch(err => console.log(err));

    socket.open();
});

//Creates room insroomIde mongodb database and automatically joins socket-room
$('#btnCreate').click(() => {
    let playerName = $('#txtUsername').val() || "Guest";
    let roomName = $('#txtRoomName').val() || "New Room";
    let maxPlayers = parseInt($('#txtMaxPlayers').val() || 4);

    if (Number.isInteger(maxPlayers)) {
        //Creates room-socket and room in database
        socket.create(roomName, playerName, maxPlayers);
    }
    else {
        alert("Max amount of players must be a number");
    }
});

//Joins the room
function join(roomId) {
    console.log("join" + roomId);
    let playerName = $('#txtUsername').val() || "Guest";
    socket.join(roomId, playerName);
}

function refresh() {
    //TODO
}

//Dispalys rooms id ul-Tag
function displayRooms(rooms) {
    let ul = document.getElementById("ulRooms");
    rooms.forEach(room => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(room.name));
        let joinButton = document.createElement("button");
        joinButton.innerHTML = "Join";6
        joinButton.classList.add("btnJoin");
        joinButton.roomId = room._id;
        joinButton.addEventListener("click", () => {
            join(room._id);
        });
        li.appendChild(joinButton);
        ul.appendChild(li);
    });
}

function getRooms() {
    return new Promise((resolve, reject) => {
        //Fetch all currently existing rooms
        fetch("http://localhost:3000/rooms/all")
        .then(rooms => {
            return rooms.json();
        })
        .then(roomsJson => {
            resolve(roomsJson);
        })
        .catch(err => reject(err));
    });
}

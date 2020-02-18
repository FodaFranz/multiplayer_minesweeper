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
    console.log("tes");
    let playerName = $('#txtUsername').val() || "Guest";
    let roomName = $('#txtRoomName').val() || "New Room";
    let maxPlayers = parseInt($('#txtMaxPlayers').val() || 4);

    //Needed to get the roomId of the name of the created room
    let getRoomIdPromise = new Promise((resolve, reject) => {
        fetch("http://localhost:3000/rooms/getroomroomIdofname/" + roomName)
        .then(roomId => {
            return roomId.json();
        })
        .then(roomIdJson => {
            resolve(roomIdJson._roomId);
        })
        .catch(err => reject(err));
    });

    if (Number.isInteger(maxPlayers)) {
        //Creates room-socket and room in database
        //socket.emit("create", roomName, playerName, maxPlayers);
        socket.create(roomName, playerName, maxPlayers);

        //Automatically join room when created
        getRoomIdPromise
            .then(roomId => {
                join(roomId);
            })
            .catch(err => console.log(err));
    }
    else {
        alert("Max amount of players must be a number");
    }
});

//Joins the room
function join(roomId) {
    let playerName = $('#txtUsername').val() || "Guest";
    socket.join(roomId, playerName);
}

function refresh() {
    //TODO
}

//Dispalys rooms id ul-Tag
function displayRooms(rooms) {
    let ul = document.getElementByroomId("ulRooms");
    rooms.forEach(room => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(room.name));
        let joinButton = document.createElement("button");
        joinButton.innerHTML = "Join";
        joinButton.classList.add("btnJoin");
        joinButton.roomId = room._id;
        joinButton.addEventListener("click", () => {
            this.join(room._id);
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

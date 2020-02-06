const roomSocketEvents = new RoomSocketEvents();
socket = io('http://localhost:3000');

//onload equivalent
$(() => {
    getRooms()
        .then(rooms => displayRooms(rooms))
        .catch(err => console.log(err));
});

socket.on("join", (roomId) => {
    roomSocketEvents.join(roomId);
});

//Creates room inside mongodb database and automatically joins socket-room
function create() {
    let username = $('#txtUsername').val() || "Guest";
    let roomName = $('#txtRoomName').val() || "New Room";
    let maxPlayers = parseInt($('#txtMaxPlayers').val() || 4);

    if (Number.isInteger(maxPlayers)) {
        socket.emit("create", roomName, username, maxPlayers);
        
        //Join room
        fetch("http://localhost:3000/rooms/getRoomIdOfName/roomName")
        .then(id => {
            console.log(id);
            return id;
        })
        .then(idJson => {
            console.log(idJson);
        })
        .catch(err => reject(err));
    }
    else {
        alert("Max amount of players must be a number");
    }
}

//Dispalys rooms inside ul-Tag
function displayRooms(rooms) {
    let ul = document.getElementById("ulRooms");
    let joinButton = document.createElement("button");
    joinButton.innerHTML = "Join";
    joinButton.classList.add("btnJoin");
    rooms.forEach(room => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(room.name));
        joinButton.id = room._id;
        joinButton.addEventListener("click", () => {
            roomSocketEvents.join(room._id);
        });
        li.appendChild(joinButton);
        ul.appendChild(li);
    });
}

/*
 UTILITY
*/
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
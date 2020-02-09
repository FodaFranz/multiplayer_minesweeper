socket = io();

//onload equivalent
$(() => {
    getRooms()
        .then(rooms => displayRooms(rooms))
        .catch(err => console.log(err));
});

//Creates room inside mongodb database and automatically joins socket-room
function create() {
    let username = $('#txtUsername').val() || "Guest";
    let roomName = $('#txtRoomName').val() || "New Room";
    let maxPlayers = parseInt($('#txtMaxPlayers').val() || 4);

    
    let getRoomIdPromise = new Promise((resolve, reject) => {
        fetch("http://localhost:3000/rooms/getroomidofname/" + roomName)
        .then(id => {
            return id.json();
        })
        .then(idJson => {
            resolve(idJson._id);
        })
        .catch(err => reject(err));
    });
    

    if (Number.isInteger(maxPlayers)) {
        socket.emit("create", roomName, username, maxPlayers);
        
        //Join room
        getRoomIdPromise
            .then(id => {
                
            })
            .catch(err => console.log(err));
    }
    else {
        alert("Max amount of players must be a number");
    }
}

//Joins the room
function join(id) {
    alert(id);
    location.href = "http://localhost:3000/rooms/" + id;
}

function refresh() {
    //TODO
}

//Dispalys rooms inside ul-Tag
function displayRooms(rooms) {
    let ul = document.getElementById("ulRooms");
    rooms.forEach(room => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(room.name));
        let joinButton = document.createElement("button");
        joinButton.innerHTML = "Join";
        joinButton.classList.add("btnJoin");
        joinButton.id = room._id;
        joinButton.addEventListener("click", () => {
            this.join(room._id);
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
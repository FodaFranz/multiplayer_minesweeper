$(() => {
    getRooms()
        .then(rooms => displayRooms(rooms))
        .catch(err => console.log(err));
});

//Creates room solely in db
$('#btnCreate').click(() => {
    let playerName = $('#txtUsername').val() || "Guest";
    let roomName = $('#txtRoomName').val() || "New Room";
    let maxPlayers = parseInt($('#txtMaxPlayers').val() || 4);

    if (Number.isInteger(maxPlayers)) {
        fetch("http://localhost:3000/rooms/create", {
                method: "POST",
                headers: {  "Content-Type": "application/json" },
                body: JSON.stringify({ playerName: playerName, roomName: roomName, maxPlayers: maxPlayers })
            })
            .then(res => {
                return res.json();
            })
            .then(roomId => {
                redirectToRoom(playerName, roomId);
            })
            .catch(err => alert(err));
    }
    else {
        alert("Max amount of players must be a number");
    }
});

//Joins the room
function join(roomId) {
    let playerName = $('#txtUsername').val() || "Guest";
    
    fetch("http://localhost:3000/rooms/join/" + roomId, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: playerName })
    })
    .then(res => {
        return res.json();
    })
    .then(resJson => {
        if(resJson == true) {
            redirectToRoom(playerName, roomId);
        } 
        else {
            //Room should be full
            alert(resJson);
        }
    })
    .catch(err => alert(err))
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
        joinButton.innerHTML = "Join"; 6
        joinButton.classList.add("btnJoin");
        joinButton.roomId = room._id;
        joinButton.addEventListener("click", () => {
            join(room._id);
        });
        li.appendChild(joinButton);
        ul.appendChild(li);
    });
}

function redirectToRoom(playerName, roomId) {
    localStorage.setItem("playerName", playerName);
    location.href = "http://localhost:3000/rooms/" + roomId;
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

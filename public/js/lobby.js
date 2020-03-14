$(() => {
    getRooms()
        .then(rooms => displayRooms(rooms))
        .catch(err => console.log(err));
});

/*
    Creates room inside database without adding the creation-user into the user-array.
    The user will be added to the user-array in the onload-function of the room-page.
*/
$('#btnCreate').click(() => {
    let playerName = $('#txtUsername').val() || "Guest";
    let roomName = $('#txtRoomName').val() || "New Room";
    let maxPlayers = parseInt($('#txtMaxPlayers').val() || 4);

    let height = $("#txtHeight").val() || 16;
    let width = $("#txtWidth").val() || 30;
    let bombs = $("#txtMines").val() || 99;

    if (Number.isInteger(maxPlayers)) {
        fetch("http://localhost:3000/rooms/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    roomName: roomName, 
                    maxPlayers: maxPlayers,
                    height: height,
                    width: width,
                    mines: mines
                })
            })
            .then(res => {
                if(res.status == 200)
                    return res.json();
                else 
                    throw new Error("Error creating lobby");
            })
            .then(roomId => {
                redirectToRoom(playerName, roomId);
            })
            .catch(err => console.log(err));
    }
    else {
        alert("Max amount of players must be a number");
    }
});

function join(roomId) {
    let playerName = $('#txtUsername').val() || "Guest";
    
    redirectToRoom(playerName, roomId);
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

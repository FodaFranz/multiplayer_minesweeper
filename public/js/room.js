let _id = "";
let _playerName = "";

$(() => {
    //Initialize _id with the id of the room when html page is loaded
    let splittedUrl = window.location.href.split("/");
    _id = splittedUrl[splittedUrl.length - 1];
    _playerName = localStorage.getItem("playerName");
    console.log(_playerName);
});

function leave() {
    
}
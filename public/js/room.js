let _id = "";

$(() => {
    //Initialize _id with the id of the room when html page is loaded
    let splittedUrl = window.location.href.split("/");
    _id = splittedUrl[splittedUrl.length - 1];
});
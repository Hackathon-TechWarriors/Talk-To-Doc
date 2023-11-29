import { io } from "socket.io-client";
const socket = io("http://127.0.0.1:5000");

socket.on('connect', function() {
    console.log("Connected!");
});

socket.on('uploadcomplete', function(res) {
    socket.emit("SummarizeInput",{"data":"Files/"+res?.data})
})

export default socket;
// connect to sever
var socket = io("http://123.193.22.129:502/");
console.log("connect to server");

// set up socket.on for data received from sever
// server trigger 'data' event when data is received from device.
// socket.on('data', function(data) {
//     console.log('received:', data);
// });
// ask server to get registers
// "Read Input Registers" (FC=04) 
socket.emit("readHoldingRegisters", {
    "unit": 1,
    "address": 0,
    "length": 2,
    "interval": 1000
});
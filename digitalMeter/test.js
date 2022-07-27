const ModbusRTU = require("modbus-serial");
// create an empty modbus client
const client = new ModbusRTU();
// open connection to a serial port
// open connection to a tcp line
// RTUBuffered
client.connectTCP("123.193.22.129", { port: 1621 }) // localAddress: "192.168.2.99"
    .then(setClient(93))
    .then(function() {
        console.log("Connected");
    })
    .catch(function(e) {
        console.log(e.message);
    });

function setClient(device_id) {
    // console.log(client.isOpen());
    // set the client's unit id
    // set a timout for requests default is null (no timeout)
    client.setID(device_id);
    client.setTimeout(5000);
    // run program
    run();
}

function run() {
    client.readHoldingRegisters(0, 2)
        .then(function(d) {
            console.log("Receive:", d.data);
            console.log("Receive:", d);
        })
        .catch(function(e) {
            console.log(e.message);
        })
        .then(close);
}

function close() {
    client.close();
}
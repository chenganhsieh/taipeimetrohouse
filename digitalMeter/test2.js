const ModbusRTU = require("modbus-serial");
// create an empty modbus client
const client = new ModbusRTU();
// open connection to a serial port
// client.connectRTUBuffered("/dev/ttyS0", { baudRate: 9600 });
client.connectTCP("123.193.22.129", { port: 1621 });
// set timeout, if slave did not reply back
client.setTimeout(1000);

// list of meter's id
const metersIdList = []
for (i = 0; i < 255; i++) {
    metersIdList.push(i)

}
// const metersIdList = [10, 11, 12, 13, 14];

const getMetersValue = async(meters) => {
    try {
        // get value of all meters
        for (let meter of meters) {
            // output value to console
            console.log(await getMeterValue(meter));
            // wait 100ms before get another device
            await sleep(100);
        }
    } catch (e) {
        // if error, handle them here (it should not)
        console.log(e)
    }
    // finally {
    //     // after get all data from salve repeate it again
    //     setImmediate(() => {
    //         getMetersValue(metersIdList);
    //     })
    // }
}

const getMeterValue = async(id) => {
    try {
        // set ID of slave
        await client.setID(id);
        // console.log(client.getID());
        // read the 1 registers starting at address 0 (first register)
        let val = await client.readHoldingRegisters(0, 2);
        // return the value
        return val;
    } catch (e) {
        // if error return -1
        return -1
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// start get value
getMetersValue(metersIdList);
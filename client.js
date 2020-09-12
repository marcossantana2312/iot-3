const { readFileSync } = require("fs")
const net = require('net');

(async () => {
    const file = await readFileSync("/home/marcos/Documentos/JS/IoT/iot - 3/lista_dispositivo.txt");
    const devices = file.toString().split("\n").map((e) => {
        return {
            name: e.split(" ")[0],
            ip: e.split(" ")[1],
            port: parseInt(e.split(" ")[2], 10) 
        }
    });

    const [, , nameDevice1, action, nameDevice2] = process.argv;

    const device1 = devices.find(d => d.name === nameDevice1);
    const device2 = devices.find(d => d.name === nameDevice2);

    if (!device1 || !device2) {
        throw Error(`Some device not founded`);
    }

    const client = new net.Socket();

    client.connect(device1.port, device1.ip, () => {
        console.log("connected")
        client.write(JSON.stringify(device2));
    });
})();
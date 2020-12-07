const { readFileSync } = require("fs")
const net = require('net');
const axios = require("axios");

const [IP, PORT] = ['127.0.0.1', 4000];
const DEVICE_NAME = "Client"
const URL = "http://localhost:3000";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const server = net.createServer(async (socket) => {
    // const file = readFileSync("/home/marcos/Documentos/JS/IoT/iot - 3/lista_dispositivo.txt");
    // const devices = file.toString().split("\n").map((e) => {
    //     return {
    //         name: e.split(" ")[0],
    //         ip: e.split(" ")[1],
    //         port: parseInt(e.split(" ")[2], 10) 
    //     }
    // });

    // let [nameDevice1, action, nameDevice2] = process.argv.splice(2);

    // if (nameDevice1 && nameDevice2) {
    //     handleConnection(socket, nameDevice1, nameDevice2, devices)
    // }
    // console.log( nameDevice1, nameDevice2)
    // socket.on("data", (data) => {
    //     [nameDevice1, action, nameDevice2] = data.toString().split(" "); 
    // })
})

const handleConnection = (client, nameDevice1, nameDevice2, devices) => {

    const device1 = devices.find(d => d.name === nameDevice1);
    const device2 = devices.find(d => d.name === nameDevice2);

    if (!device1 || !device2) {
        throw Error(`Some device not founded`);
    }

    client.connect(device1.port, device1.ip, () => {
        console.log("connected")
        client.write(JSON.stringify(device2));
    });
}

server.listen(PORT, IP, async () => {
    console.log(`${DEVICE_NAME} running at ${IP}:${PORT}`)
    while (true) {
        const ocorrenciasFile = readFileSync(__dirname + "/ocorrencias.txt");

        const data = ocorrenciasFile.toString().split("\n").map(e => e.replace(",", ""));
        console.log(data);

        await sendDataToServer(data)
        await sleep(30000);
    }

    async function sendDataToServer(data) {
        try {
            await axios.post(URL, { data });
        } catch (err) {
            console.log(err);
        }
    }
});
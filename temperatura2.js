const net = require('net');

const DEVICE_NAME = "Temperatura_2" 
const STATE = "ATIVADO";
const UPDATE_IN = 5;
const [IP, PORT] = ['127.0.0.1', 9980];

const server = net.createServer((socket) => {

    socket.on("data", data => {
        data = data.toString();
        console.log(data);

        if (data.includes("ip") && data.includes("port")) {
            const { ip, port } = JSON.parse(data);

            const client = new net.Socket();

            client.connect(port, ip, () => {
                console.log("connected to " + port)
                client.write("CONNECT");
            });

            client.on("data", (data1) => console.log(data1.toString()));
        }

        if (data.includes("CONNECT")) {
            socket.write(Buffer.from(`${DEVICE_NAME} ${STATE} ${UPDATE_IN}`))
            setInterval(() => socket.write(Buffer.from((Math.random() * 50).toString())), UPDATE_IN * 1000);
        }

    })
});

server.listen(PORT, IP, () => console.log(`${DEVICE_NAME} running at ${IP}:${PORT}`));
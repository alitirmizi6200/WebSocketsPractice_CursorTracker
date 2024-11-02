import http from 'http'; 
import { connect } from 'http2';
import ws, { WebSocketServer } from 'ws'
import url from 'url'
import { randomUUID } from 'crypto';

const server = http.createServer();

const wsServer = new WebSocketServer({ server })
const PORT = 8080; 
const connectionList = {}

function broadcastToOthers(uuid) {
    // Create a shallow copy of the user's data, excluding `connection`
    const { connection, user } = connectionList[uuid];
    
    // Structure the response with the uuid as the key
    const response = {
        [uuid]: user,
    };

    Object.keys(connectionList).forEach((key) => {
        const clientConnection = connectionList[key]?.connection;

        // Ensure the connection exists and is open before sending the data
        if (clientConnection && clientConnection.readyState === clientConnection.OPEN) {
            try {
                clientConnection.send(JSON.stringify(response));
            } catch (error) {
                console.log(`Failed to send message to ${key}: ${error.message}`);
            }
        }
    });
}

function handleMessageRequest(bytes, uuid) { // messages will be recieved in bytes then do bytes.strig() thn JSON.parse
    try {
        const message = JSON.parse(bytes.toString())
        
        console.log(message)
        // { 
        //     "cursor_update": {
        //         "x": 50,
        //         "y": 1000
        //     }
        // }

        const user = connectionList[uuid].user; 
        if (message.cursor_update){
            user.state.x = message.cursor_update.x;
            user.state.y = message.cursor_update.y;
        }

        broadcastToOthers(uuid)
    
    } catch(e) {
        console.log(`invalid request + ${e}`)
    }
}

function handleClose(uuid) {
    const connection = connectionList[uuid]; 
    delete connectionList[uuid].user
    broadcastToOthers(uuid)
}


wsServer.on("connection" , (connection, request) => {
    // spresify protocol ws / wss 
    // ws://localost:8080?username=aaa
    const { username } = url.parse(request.url, true).query
    if (!username) {
        // Close connection if username is missing
        connection.close(1008, "Username is required");
        return;
    }
    const uuid  =  randomUUID();
    connectionList[uuid] = {
        connection: connection,
        user: { 
            username: username, 
            state: {
                x: 0,
                y: 0 // states like online, offline, typing, etc..
            }} 
    }

    connection.on('message', message => handleMessageRequest(message, uuid))
    connection.on('close', () => {handleClose(uuid)})
})
server.listen(PORT, () => console.log(`listining on PORT ${PORT}`))



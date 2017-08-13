const WebSocketServer = require('websocket').server;

const path = require('path');
const express = require('express');
const app = express();

let connections = [];


app.use('/', express.static('../../dist'));

app.listen(8888, '192.168.1.95', function () {
    console.log('Example app listening on port 80!')
});

const wsServer = new WebSocketServer({
    httpServer: app,
    fragmentOutgoingMessages: false,
    autoAcceptConnections: true
});

function originIsAllowed($origin) {
    //TODO: filter origins
    return true;
}

wsServer.on('request', ($req) => {
    console.log('Request: ', $req);
    //Validate Origin
    if(!originIsAllowed($req.origin)){
        $req.reject();
        console.log((new Date()) + ' Connection from origin ' + $req.origin + ' rejected.');
        return;
    }

    //Accept Connection
    let connection = $req.accept('clip-proto', $req.origin);
    console.log((new Date()) + ' Connection accepted.');

    //Add connection to list
    console.log('Adding Connection');
    connections.push(connection);

    //Listen for close and message
    connection.on('message', ($message) => {
        console.log('Caught Message of Type: ', $message.type);

        if($message.type === 'utf8'){
            //Text Message
            console.log('Received utf8 Message: ' + $message.utf8Data);
        } else if($message.type === 'binary') {
            //Binary Data
            console.log('Received Binary message of length(in bytes): ' + $message.binaryData.length);
        }
    });

    connection.on('close', ($reasonCode, $desc) => {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        console.log('ReasonCode: ', $reasonCode);
        console.log('Desc: ', $desc);

        //Remove connection
        for(let i = 0; i < connections.length; i++){
            if(connections[i] === connection){
                console.log('Removing Connection: ', i);
                connections.splice(i, 1);
            }
        }

    });

});

var http = require('http');
var url = require('url');
const socket = require('socket.io');

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const fileOperations = require('./file-operations');
const clients = require('./client-module');

const server = http.createServer();
const io = socket(server);

io.on('connection', client => {
    console.log('Socket connection is made');
    client.on('username', function(username) {
        console.log("Username: ", username);
        client.username = username;
        clients.onUserConnected(client, username);
    });
    client.on('event', data => { /* … */ });
    client.on('disconnect', () => {
        clients.onUserDisConnected(client.username);
     });
});
server.listen(3000);

console.log('Server is up and running');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.json({"message": "Remote Debugging server"});
});
app.get('/commands/view', (req, res, next) => {
    var q = url.parse(req.url, true);
    console.log("Received command  ", req.url);
    console.log("Host ", q.host);
    console.log("Path ", q.path);
    console.log("Query ", q.query);
    var userSocket = io.sockets.connected
    fileOperations.onViewFile(userSocket, q.query);
    return res.sendStatus(200);
});

app.listen(8080, () => {
    console.log("Server is listening on port", 8080);
});
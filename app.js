var http = require('http');
var url = require('url');
const socket = require('socket.io');

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const fileOperations = require('./file-operations');
const clientManager = require('./client-module');
const multer = require('./multer.config');

const mkdirp = require('mkdirp');
const path = require('path');
var fs = require('fs');

const server = http.createServer();
const io = socket(server);

io.on('connection', client => {
    console.log('Socket connection is made');
    client.on('username', function (username) {
        console.log("Username: ", username);
        client.username = username;
        clientManager.onUserConnected(client, username);
    });
    client.on('view', function (data) {
        // console.log("Data: ", data);
        try {
            const files = JSON.parse(data);
            files.forEach(file => {
                console.log(file.name, " ", file.size / 1000, "MB");
            });
            if (callback != null) {
                callback(null, data);
            }
        } catch (err) {
            console.error(err)
        }
    });
    client.on('status', function (data) {
        // console.log("Data: ", data);
        try {
            console.log("Data: ", data);
        } catch (err) {
            console.error(err)
        }
    });
    client.on('event', data => { /* … */ });
    client.on('disconnect', () => {
        clientManager.onUserDisConnected(client.username);
    });
});
server.listen(3000);

console.log('Server is up and running');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

var callback;
app.get('/commands/view', (req, res, next) => {
    var q = url.parse(req.url, true);
    callback = function (err, data) {
        console.log('got data: ' + data);
        callback = null;
        return res.status(200).send(data);
    };
    fileOperations.onViewFile(q.query);
    // return res.sendStatus(200);
});
app.get('/commands/download', (req, res, next) => {
    var q = url.parse(req.url, true);
    callback = function (err, data) {
        console.log('got data: ' + data);
        callback = null;
        return res.status(200).send(data);
    };
    fileOperations.onDownloadFile(q.query);
    // return res.sendStatus(200);
});

var upload = multer.single('file');
app.post('/fileupload', function (req, res) {
    console.log('fileupload started');
    let directory = path.join('public/uploads');
    upload(req, res, function (err) {
        if (err) {
            console.log('Error ', err);
            return res.end("Error uploading file.");
        }
        console.log('File is uploaded to path ', req.file);

        fs.readFile(req.file.path, "utf8", function (err, data) {
            //console.log('Content ', data);
            if (callback != null) {
                callback(null, data);
            }
        });

        // res.end("File is uploaded");
        res.end(req.file.path);
    });
});

app.get('/users', (req, res, next) => {
    console.log(clientManager.connectedUsers());
    var names = [];
    for (var k in clientManager.connectedUsers())
        names.push(k);
    console.log(names);
    res.send(JSON.stringify(names));
});

app.listen(8080, () => {
    console.log("Server is listening on port", 8080);

    mkdirp.sync(path.join(__dirname, '..', 'public/uploads'), (err) => {
        if (err) {
            console.log('Error creating directory', err);
        } else {
            console.log('Successfully created uploads directory');
        }
    });
});
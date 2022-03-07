var url = require('url');

const clients = require('./client-module');

module.exports = {
    onViewFile: function(data) {
        console.log("data: ", data);
        // console.log("Username: ", data[username]);
        var socket = clients.socketForUser("suresh");
        var command = {};
        command.command = 'view';
        command.destination = data["destination"];
        socket.emit("command", command);
    },
    onDownloadFile: function(data) {
        console.log("data: ", data);
        // console.log("Username: ", data[username]);
        var socket = clients.socketForUser("suresh");
        var command = {};
        command.command = 'download';
        command.destination = data["destination"];
        socket.emit("command", command);
    }
}
var url = require('url');

const clients = require('./client-module');

module.exports = {
    onViewFile: function(socket, data) {
        console.log("data: ", data);
        // console.log("Username: ", data[username]);
        var socket = clients.socketForUser("suresh");
        socket.emit("command", data);
    }
}
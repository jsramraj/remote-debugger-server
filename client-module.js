
var connectedClients = {};

module.exports = {
    onUserConnected: function(socket, username) {
        console.log("User connected ", username);
        connectedClients[username] = socket;
    },
    onUserDisConnected: function(username) {
        console.log("User disconnected ", username);
        delete connectedClients[username];
    },
    socketForUser: function(username) {
        return connectedClients[username];
    }
}
var http = require("http"),
	express = require("express"),
    fs = require("fs"),
    socketio = require("socket.io");

var clients = [];
var messages = [];

var app = express(),
    server = http.createServer(app);

app.use(express.static(__dirname + '/pages'));
	
var count_conn = 0;

var storeMessage = function(name,data) {
	var message = name + ": " + data;
	messages.push(message)
	if(messages.length > 10) {
		messages.shift();
	}
	console.log(messages)
}

var io = socketio.listen(server)

io.sockets.on('connection', function (socket) {
	count_conn++
	console.log("client connected: connection "+count_conn)
	
	socket.on("join",function(data){
		var nick = data;
		if(nick=='Anonymous') {
			nick = nick + count_conn;
		}
		
		clients.push(nick)
		socket.set('nickname', nick)
		
		socket.broadcast.emit("join",nick)
		
		clients.forEach(function(client) {
			if(client!=nick) {
				socket.emit("join", client)
			}
		})
		
		messages.forEach(function(message) {
			socket.emit("chat", message)
		})
		
	})
	
	socket.on("disconnect",function(data){
		socket.get('nickname', function(err, name) {
			var clientsAux = [];
			clients.forEach(function (client) {
				if(client!=name) {
					clientsAux.push(client)
				}
			}) 
			clients = clientsAux
			socket.broadcast.emit("disconnect",name)
		})
	})
	
	socket.on("message",function(message) {
		socket.get('nickname', function(err, name) {
			storeMessage(name,message)
			socket.broadcast.emit("chat", name + ": " + message)
			console.log("new message from "+name+": "+message)
		})
	})
})

server.listen(process.env.PORT || 8000, "127.0.0.1")
console.log("Server starded on port 8000.")

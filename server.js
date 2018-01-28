var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('public'))

app.listen(80);

var io = require('socket.io').listen(8081);

var largestID = 0;
var id_associations = {};

io.sockets.on('connection', function (socket) {
	socket.on('message', function (e) {
		console.log(e) 
		
		//send this message to all sockets
		io.sockets.emit('message', {'text': 'hello'});
	});
	socket.on('new_id', function(e){
		console.log("getting id")
		io.sockets.emit('id_save', {id: largestID})
		largestID += 1;
	})
	socket.on('connect_to_server', function(e){
		console.log("connecting")
		client_id = e.client;
		server_id = e.server;
		if(!(server_id in id_associations)){
			id_associations[server_id] = []
		}
		if (!id_associations[server_id].includes(client_id)){
			id_associations[server_id] = id_associations[server_id].concat(client_id);
		}
		console.log(id_associations[server_id])
	})
	
	socket.on('disconnect', function () { console.log('disconnected!')});
});

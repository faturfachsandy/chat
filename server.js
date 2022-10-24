const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var userlog = {};
var usernya = [];

io.on('connection', function(socket){

	socket.on('regis', function(user){
		if (usernya.indexOf(user) != -1) {
			socket.emit('regres', true);
		}else{
			userlog[socket.id] = user;
			usernya.push(user);
			socket.emit('regres', false);
			io.emit('online', usernya);
			socket.broadcast.emit('info', anu = userlog[socket.id] + ' Telah Bergabung');
		}
	});

	socket.on('newMessage', function(msg){
		msg[1] = userlog[socket.id];
		io.emit('newMessage', msg);
		console.log('Chat Baru: ' + msg[0] + ' oleh : ' + msg[1]);
	});

	socket.on('disconnect', function(){
		//socket.emit('disconnect', userlog[socket.id]);
		io.emit('hapusUser', userlog[socket.id]);
		socket.broadcast.emit('info', anu = userlog[socket.id] + ' Keluar Dari Chat');
		var indx = usernya.indexOf(userlog[socket.id]);
		delete userlog[socket.id];
		usernya.splice(indx, 1);
	});

});


http.listen(3000, function(){
	console.log('list on 3000...');
});


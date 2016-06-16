var express = require('express');
var socketio = require('socket.io');
var path =require('path');
var app = express();
//setup
app.use(express.static(path.join(__dirname, "./client")));``
// app.set("views",path.join(__dirname, "./client"));
app.set("view engine","ejs");

//simple route
app.get('/', function(req,res){
  res.render("index");
});


//server
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});

var io = socketio.listen(server);


//// socket stuff ////

var users = [];
var history = [
	{
		name : 'Max',
		msg : 'hello there!'
	},
	{
		name : 'Minh',
		msg : 'Hi I was here earlier!'
	}
];

io.sockets.on('connection', function (socket) {
  var user = {}
  socket.on("new_user", function (data){
      data.id = socket.id//??
      users.push(data)//add to users array
      user=data;
      socket.broadcast.emit('someone_joined', data)//announce to to everyone else the new user
      socket.emit('all_history',history)//refresh history back to new person
  })
  socket.on('someone_messaged', function(data){
    data.name = user.name;
    history.push(data)//add to history
    io.emit('display_message', data)
  })
  socket.on('disconnect', function(){
    for (var i = 0; i < users.length; i++) {
      if (socket.id == users[i].id) {
        users.splice(i,1)
      }
    }
  })
  socket.on("reset_clicked", function (data){
      console.log('Someone clicked reset!');
      numClicks = 0;
      socket.emit('server_response', numClicks);
  })
})

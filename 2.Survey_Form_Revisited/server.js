var express = require('express');
var path =require('path');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "./static")));
app.set("views",path.join(__dirname, "./views"));
app.set("view engine","ejs");

app.get('/', function(req,res){
  res.render("main");
});
app.post('/result', function(req, res){
  console.log(req.body);
  res.render('result', {info: req.body});

})
// this selects our port and listens
// note that we're now storing our app.listen within
// a variable called server. this is important!!
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});
// this is a new line we're adding AFTER our server listener
// take special note how we're passing the server
// variable. unless we have the server variable, this line will not work!!
var io = require('socket.io').listen(server);
// Whenever a connection event happens (the connection event is built in) run the following code
io.sockets.on('connection', function (socket) {
  console.log("WE ARE USING SOCKETS!");
  console.log(socket.id);
  //all the socket code goes in here!
  //  EMIT:
  socket.emit('my_emit_event');
  //  BROADCAST:
  socket.broadcast.emit("my_broadcast_event");
  //  FULL BROADCAST:
  io.emit("my_full_broadcast_event");
  // If you don't know where this code is supposed to go reread the above info
  socket.on("button_clicked", function (data){
      console.log('Someone clicked a button!  Reason: ' + data);
      console.log('name from view'+ data.name);
      socket.emit('server_response', {response: "sockets are the best!"});
  })
})

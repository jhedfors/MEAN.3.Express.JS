var express = require('express');
var path =require('path');
var app = express();
app.use(express.static(path.join(__dirname, "./static")));
app.set("views",path.join(__dirname, "./views"));
app.set("view engine","ejs");

app.get('/', function(req,res){
  res.render("index");
});

var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});
// this is a new line we're adding AFTER our server listener
// take special note how we're passing the server
// variable. unless we have the server variable, this line will not work!!
var io = require('socket.io').listen(server);

// Whenever a connection event happens (the connection event is built in) run the following code
var numClicks = 0;
var prevClicked = new Date();
var scoreBoard = []
io.sockets.on('connection', function (socket) {
  console.log("WE ARE USING SOCKETS!");
  console.log(socket.id);
  //all the socket code goes in here!
  socket.on("button_clicked", function (data){
      console.log('Someone clicked a button!');
      numClicks ++;
      // console.log('numClicks);
      timeClicked = new Date();
      var elapsedTime = Math.floor((timeClicked - prevClicked )/1000)
      scoreBoard.push(elapsedTime);
      scoreBoard.sort();
      console.log(scoreBoard);
      prevClicked = timeClicked;

      socket.emit('server_response', {numClicks: numClicks, elapsedTime:elapsedTime});
  })
  socket.on("reset_clicked", function (data){
      console.log('Someone clicked reset!');
      numClicks = 0;
      socket.emit('server_response', numClicks);
  })
})

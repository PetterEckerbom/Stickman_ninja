var express = require('express');
var app = express();
var serv = require('http').Server(app);
var path = require('path');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var session = require("express-session")({
    secret: "I like trains",
    resave: true,
    saveUninitialized: true
});
var mongoose = require('mongoose');
var sharedsession = require("express-socket.io-session");
let User = require('./models/user');

let matchmaking = require('./matchmaking_server.js');

app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


mongoose.connect('mongodb://localhost/stickman');
let db =mongoose.connection;

//check connection
db.once('open',function(){
  console.log("connected to mongodb")
});

//check db error
db.on('error',function(err){
  console.log(err);
});

serv.listen(5000);
console.log("server started");

app.use(session);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var index = require('./routes/index');
var users = require('./routes/users');
app.use('/', index);
app.use('/users', users);

var SOCKETS = {};
var GAMES = [];
var STARTED_GAMES = [];
exports.SOCKETS = SOCKETS;
exports.GAMES = GAMES;
exports.STARTED_GAMES = STARTED_GAMES;

//socket.handshake.session.
var io = require("socket.io")(serv)
io.use(sharedsession(session));
io.on("connection", function(socket) {
	var id = Math.random()
	socket.id =id;
	SOCKETS[id] = socket
	socket.on('match_making',function(type){
		matchmaking.find_match(socket, type);
	});
  socket.on("disconnect",function(){
    var queue_check = matchmaking.findplayer(GAMES, socket.id);
    var games_check = matchmaking.findplayer(STARTED_GAMES, socket.id);
    if(queue_check != -1){
      GAMES.splice(queue_check.index, 1);
    }else if(games_check != -1){
      STARTED_GAMES[games_check.index][games_check.NotPlayer].socket.emit('Opponent_DC');
      STARTED_GAMES.splice(games_check.index, 1);
    }
    console.log("Queue " + GAMES.length);
    console.log("Running games "+STARTED_GAMES.length)
  })
});

			/*for(var i = 0; i < GAMES.length; i++){
				if(GAMES[i].player2 == null){
					plyr.x = 100;
					plyr.facing = "left"
					GAMES[i].player2 = plyr;
					GAMES[i].player2.socket.emit("Game_start", GAMES[i].player1.name);
					GAMES[i].player1.socket.emit("Game_start", GAMES[i].player2.name);
					found = true;
					index = i;
				}
			}*/

/*function increse_score(username,socket){
  return User.findOne({ username: username}, function(err, userDoc) {
if (err)
{
  console.log(err);
  return;
}
if (! userDoc)
{

}
else
{
  userDoc.elo++;
  socket.emit("your_score", userDoc.elo);
  userDoc.save(function (err) {
      if (err)
      {
        console.log(err);
        return;
      }
      return userDoc;
  });
}
});
}
function leader_update(){
  leaderboard =[];
  User.find({}).sort({score: -1}).exec(function (err, userQ) {
    for(var i in userQ){
     leaderboard.push(userQ[i].username + ": " + userQ[i].score);

   }
   for(var i in SOCKETS){
     SOCKETS[i].emit('leaderboard', leaderboard);
   }
  });
}*/

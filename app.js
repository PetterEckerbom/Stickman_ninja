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
var User = require('./models/user');
var flash = require('connect-flash');
var game_clock = require('./game_clock.js');
var communication = require('./communication.js');

//brings in exported functions from matchmaking such as tha matchmaking fuckion etc
var matchmaking = require('./matchmaking_server.js');

//makes anything in /public open for anyone to see
app.use(express.static(path.join(__dirname, 'public')));

//set viewengien to pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//connect to database
mongoose.connect('mongodb://localhost/stickman');
var db =mongoose.connection;

//check connection
db.once('open',function(){
  console.log("connected to mongodb");
});

//check db error
db.on('error',function(err){
  console.log(err);
});

//starts server
serv.listen(5000);
console.log("server started");

//enables sessions
app.use(session);
//start connect-flash and express-messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//allows us to check users form input
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//reroutes any requests related to users to users.js and "normal requests" to index.js
var index = require('./routes/index');
var users = require('./routes/users');
app.use('/', index);
app.use('/users', users);

//Creates Array and objects related to game and makes accessable from any file
var SOCKETS = {};
exports.SOCKETS = SOCKETS;

//Allows us to edit and acces session infromation from socket.
var io = require("socket.io")(serv)
io.use(sharedsession(session));
io.on("connection", function(socket) {
  //gives ID to socket and saves it in SOCKETS object. Useful to manage sockets noy in game
	var id = Math.random();
	socket.id =id;
	SOCKETS[id] = socket;
  //calls for a match to be created, gives out what elo user asked for and the socket
	socket.on('match_making_ranked',function(type){
    if(socket.handshake.session.user){
      matchmaking.find_ranked(socket, type);
    }else{
      socket.emit('not_logged_in')
    }
	});
  socket.on('match_making_casual',function(){
    if(socket.handshake.session.user){
      matchmaking.find_casual(socket);
    }else{
      socket.emit('not_logged_in')
    }
	});
  socket.on('match_making_friend',function(data){
    if(data.code.length != 5 || data.code*1 % 1 != 0){
      socket.emit('bad_code');
    }else{
        if(socket.handshake.session.user){
            if(data.new_match){
              socket.codeID = data.code;
              matchmaking.create_match_friend(socket, data.code);
            }else{
              socket.codeID = data.code;
            	matchmaking.find_match_friend(socket, data.code);
            }
        }
      }
	});


socket.on('move', function(data){
  communication.move_change(socket, data);
});

socket.on('jump', function(){
  communication.jump(socket);
});

socket.on('back_ping',function(id){
  var gamecheck = matchmaking.findplayer(matchmaking.STARTED_GAMES,socket.id);
  var d = new Date();
  var n = d.getTime();
  if(gamecheck != -1){
    if(matchmaking.STARTED_GAMES[gamecheck.index].players[gamecheck.Player].pingID == id){
      //console.log("Hey")
      matchmaking.STARTED_GAMES[gamecheck.index].players[gamecheck.Player].ping = (n - matchmaking.STARTED_GAMES[gamecheck.index].players[gamecheck.Player].time)/2;
    }
  }
});

socket.on("disconnect",function(){
  matchmaking.disconnect(socket);
});
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

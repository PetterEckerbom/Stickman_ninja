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
var punch = require('./punch.js');
var playeractions = require('./playeractions.js');
var boxes = require('./boxes.js');
var items = require('./items.js');

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
var io = require("socket.io")(serv);
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
      socket.emit('not_logged_in');
    }
	});
  //CAlls for a casual match to be created works simular to ranked but stored in other array and doesnt care about elo
  socket.on('match_making_casual',function(){
    if(socket.handshake.session.user){
      matchmaking.find_casual(socket);
    }else{
      socket.emit('not_logged_in');
    }
	});
  //Asks for a match to be created or found, stores code in the socket object and calls apropriate function.
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

//Reroutes movement request to to playeractions.js
socket.on('move', function(data){
  playeractions.move_change(socket, data);
});

//Reroutes jump request to to playeractions.js
socket.on('jump', function(){
  playeractions.jump(socket);
});

//Reroutes punch request to to punch.js
socket.on('punch', function(up){
  if(up){
    punch.punch_up(socket);
  }else{
    punch.punch(socket);
  }
});
socket.on('swipe', function(){
    punch.swipe_kick(socket);
});

//Takes ping id and chcks when that id was sent, then calculates latency and stores in the player object.
socket.on('back_ping',function(id){
  var gamecheck = matchmaking.findplayer(matchmaking.STARTED_GAMES,socket.id);
  var d = new Date();
  var n = d.getTime();
  if(gamecheck != -1){
    var player = matchmaking.STARTED_GAMES[gamecheck.index].players[gamecheck.Player];
    if(player.Ptime[id]){
      player.ping = (n - player.Ptime[id])/2;
      player.Ptime = {};
    }
  }
});
socket.on('kick', function(){
  punch.kick_down(socket);
});
socket.on('new_box',function(type){
  var game = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  boxes.create_box(type, game.index);
});

socket.on('open_box',function(){
  boxes.open_box(socket);
});

socket.on('throw', function(force){
  items["shuriken"](socket, force);
});
socket.on('throw_bomb', function(force){
  items["bomb"](socket, force);
});
socket.on('throw_iceball', function(force){
  items["iceball"](socket);
});
socket.on('throw_banana', function(force){
  items["banana"](socket);
});
socket.on('activate_wings', function(){
  items["wings"](socket);
});

socket.on('use_item', function(info){
  if(info > 500){
    info = 500;
  }
  var game_index = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(game_index != -1){
    var player = matchmaking.STARTED_GAMES[game_index.index].players[game_index.Player];
    if(player.item != "nothing"){
      items[player.item](socket, info);
    }
}
});
//Reroutes diconnects to matchmaking.js
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

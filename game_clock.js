let matchmaking = require('./matchmaking_server.js');
let physics = require('./physics.js');

setInterval(function(){
    matchmaking.setstate();
    physics.move_players();
    physics.move_down();
},1000/30);

setInterval(function(){
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    var d = new Date();
    var n = d.getTime();
    sync(matchmaking.STARTED_GAMES[i].players[0], matchmaking.STARTED_GAMES[i].players[1]);
    matchmaking.STARTED_GAMES[i].players[0].time = n;
    matchmaking.STARTED_GAMES[i].players[1].time = n;
    matchmaking.STARTED_GAMES[i].players[0].socket.emit('ping');
    matchmaking.STARTED_GAMES[i].players[1].socket.emit('ping');
  }
},700);
/*setInterval(function(){
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    var d = new Date();
    var n = d.getTime();
    matchmaking.STARTED_GAMES[i].players[0].socket.emit('server_time',n);
    matchmaking.STARTED_GAMES[i].players[1].socket.emit('server_time',n);
  }
},400);*/

var sync = function (player1, player2){
  var player1_skinned = {x: player1.x, y: player1.y,x_speed: player1.x_speed, y_speed: player1.y_speed,facing: player1.facing, dir: player1.dir};
  var player2_skinned = {x: player2.x, y: player2.y,x_speed: player2.x_speed, y_speed: player2.y_speed,facing: player2.facing, dir: player2.dir};
  player1.socket.emit('sync', {you:player1_skinned,enemy:player2_skinned,ping:player1.ping});
  player2.socket.emit('sync', {you:player2_skinned,enemy:player1_skinned,ping:player2.ping});
};
exports.sync = sync;

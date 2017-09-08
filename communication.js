let matchmaking = require('./matchmaking_server.js');
let gameclock = require('./game_clock.js');

exports.move_change = function(socket, dir){
  if(dir > 1 || dir < -1){
    return;
  }
  	var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
      if(games_check != -1){
        if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].dir != dir){
          gameclock.sync(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player], matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer]);
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].dir = dir;
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].socket.emit('Change_direction_you', dir);
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit('Change_direction_enemy', dir);
          if(dir == 1){
            matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].facing = "right";
          }
          if(dir == -1){
            matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].facing = "left";
          }
        }
      }
};
exports.jump = function(socket){
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(games_check != -1){

    if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].jumpready){
      if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].y_speed != 0){
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].jumpready = false;
      }
      matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].y_speed = -11.5;
      gameclock.sync(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player], matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer]);

      /*matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].socket.emit('you_jump');
      matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit('enemy_jump');*/
    }
  }
};

exports.ping = function(){
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    var d = new Date();
    var time = d.getTime();
    var id = Math.random();
    var id2 = Math.random();
    matchmaking.STARTED_GAMES[i].players[0].time = time;
    matchmaking.STARTED_GAMES[i].players[1].time = time;
    matchmaking.STARTED_GAMES[i].players[0].pingID = id;
    matchmaking.STARTED_GAMES[i].players[1].pingID = id2;
    matchmaking.STARTED_GAMES[i].players[0].socket.emit('ping', {id:id,ping:matchmaking.STARTED_GAMES[i].players[0].ping});
    matchmaking.STARTED_GAMES[i].players[1].socket.emit('ping', {id:id2,ping:matchmaking.STARTED_GAMES[i].players[1].ping});
  }
};

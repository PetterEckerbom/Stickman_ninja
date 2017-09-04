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

    if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].y_speed == 0){
      matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].y_speed = -14;
      gameclock.sync(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player], matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer]);
      
      matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].socket.emit('you_jump');
      matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit('enemy_jump');
    }
  }
};

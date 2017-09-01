let matchmaking = require('./matchmaking_server.js');

exports.move_change = function(socket, dir){
  if(dir > 1 || dir < -1){
    return
  }
  	var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
      if(games_check.index != -1){
        if(matchmaking.STARTED_GAMES[games_check.index][games_check.Player].dir != dir){
          matchmaking.STARTED_GAMES[games_check.index][games_check.Player].dir = dir;
          matchmaking.STARTED_GAMES[games_check.index][games_check.Player].socket.emit('Change_direction_you', dir);
          matchmaking.STARTED_GAMES[games_check.index][games_check.NotPlayer].socket.emit('Change_direction_enemy', dir);
          if(dir == 1){
            matchmaking.STARTED_GAMES[games_check.index][games_check.Player].facing = "right"
            matchmaking.STARTED_GAMES[games_check.index][games_check.Player].x_speed = 2;
          }
          if(dir == -1){
            matchmaking.STARTED_GAMES[games_check.index][games_check.Player].facing = "left"
            matchmaking.STARTED_GAMES[games_check.index][games_check.Player].x_speed = -2;
          }
        }
      }
}
exports.jump = function(socket){
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(games_check.index != -1){
    matchmaking.STARTED_GAMES[games_check.index][games_check.Player].y_speed = -14;
    matchmaking.STARTED_GAMES[games_check.index][games_check.Player].socket.emit('you_jump');
    matchmaking.STARTED_GAMES[games_check.index][games_check.NotPlayer].socket.emit('enemy_jump');
  }
}

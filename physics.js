let matchmaking = require('./matchmaking_server.js');
let info = require('./information.js');

exports.move_players = function(){
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    if(matchmaking.STARTED_GAMES[i].player1.dir != 0){
      if(matchmaking.STARTED_GAMES[i].player1.x_speed < matchmaking.STARTED_GAMES[i].player1.max_speed && matchmaking.STARTED_GAMES[i].player1.x_speed > matchmaking.STARTED_GAMES[i].player1.max_speed*-1){
        matchmaking.STARTED_GAMES[i].player1.x_speed += matchmaking.STARTED_GAMES[i].player1.dir * matchmaking.STARTED_GAMES[i].player1.accerelation;
      }
    }
    if(matchmaking.STARTED_GAMES[i].player1.x_speed > 0){
      matchmaking.STARTED_GAMES[i].player1.x_speed -= matchmaking.STARTED_GAMES[i].player1.friction;
    }
    if(matchmaking.STARTED_GAMES[i].player1.x_speed < 0){
      matchmaking.STARTED_GAMES[i].player1.x_speed += matchmaking.STARTED_GAMES[i].player1.friction;
    }
    if(matchmaking.STARTED_GAMES[i].player1.dir == 0 && matchmaking.STARTED_GAMES[i].player1.x_speed < 0.3 && matchmaking.STARTED_GAMES[i].player1.x_speed> -0.3){
      matchmaking.STARTED_GAMES[i].player1.x_speed = 0;
    }
    matchmaking.STARTED_GAMES[i].player1.x += matchmaking.STARTED_GAMES[i].player1.x_speed;
    if(matchmaking.STARTED_GAMES[i].player2.dir != 0){
      if(matchmaking.STARTED_GAMES[i].player2.x_speed < matchmaking.STARTED_GAMES[i].player2.max_speed && matchmaking.STARTED_GAMES[i].player2.x_speed > matchmaking.STARTED_GAMES[i].player2.max_speed*-1){
        matchmaking.STARTED_GAMES[i].player2.x_speed += matchmaking.STARTED_GAMES[i].player2.dir * matchmaking.STARTED_GAMES[i].player2.accerelation;
      }
    }
    if(matchmaking.STARTED_GAMES[i].player2.x_speed > 0){
      matchmaking.STARTED_GAMES[i].player2.x_speed -= matchmaking.STARTED_GAMES[i].player2.friction;
    }
    if(matchmaking.STARTED_GAMES[i].player2.x_speed < 0){
      matchmaking.STARTED_GAMES[i].player2.x_speed += matchmaking.STARTED_GAMES[i].player2.friction;
    }
    if(matchmaking.STARTED_GAMES[i].player2.dir == 0 && matchmaking.STARTED_GAMES[i].player2.x_speed < 0.3 && matchmaking.STARTED_GAMES[i].player2.x_speed> -0.3){
      matchmaking.STARTED_GAMES[i].player2.x_speed = 0;
    }
    matchmaking.STARTED_GAMES[i].player2.x += matchmaking.STARTED_GAMES[i].player2.x_speed;
  }
  }

exports.move_down = function(){
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    var y_check = check_collision(matchmaking.STARTED_GAMES[i].player1.x, matchmaking.STARTED_GAMES[i].player1.y+matchmaking.STARTED_GAMES[i].player1.y_speed)
    if(!y_check){
       matchmaking.STARTED_GAMES[i].player1.y+=matchmaking.STARTED_GAMES[i].player1.y_speed;
       matchmaking.STARTED_GAMES[i].player1.y_speed += matchmaking.STARTED_GAMES[i].player1.gravity;
    }else{
       matchmaking.STARTED_GAMES[i].player1.y=y_check
        matchmaking.STARTED_GAMES[i].player1.y_speed = 0;
    }
    y_check = check_collision(matchmaking.STARTED_GAMES[i].player2.x, matchmaking.STARTED_GAMES[i].player2.y+matchmaking.STARTED_GAMES[i].player2.y_speed)
    if(!y_check){
       matchmaking.STARTED_GAMES[i].player2.y+=matchmaking.STARTED_GAMES[i].player2.y_speed;
       matchmaking.STARTED_GAMES[i].player2.y_speed += matchmaking.STARTED_GAMES[i].player2.gravity;
    }else{
       matchmaking.STARTED_GAMES[i].player2.y=y_check
        matchmaking.STARTED_GAMES[i].player2.y_speed = 0;
    }
  }
}

function check_collision(x, y){
  for(var i = 0; i < info.platforms.length; i++){
    if(x >= info.platforms[i].xstart && x <= info.platforms[i].xend){
      if(y >= info.platforms[i].y && y <= info.platforms[i].y +  info.platforms[i].thickness){
        return info.platforms[i].y;
      }
    }
  }
  return false;
}

var matchmaking = require('./matchmaking_server.js');
var info = require('./information.js');
var gameclock = require('./game_clock.js');
exports.move_players = function(){
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    for(var y = 0; y < 2; y++){
      var do_what = check_x_move(matchmaking.STARTED_GAMES[i].players[y]);
      if(do_what == "stop"){
        if(matchmaking.STARTED_GAMES[i].players[y].x_speed < 0){
          matchmaking.STARTED_GAMES[i].players[y].x += 5;
        }else{
          matchmaking.STARTED_GAMES[i].players[y].x -= 5;
        }
        matchmaking.STARTED_GAMES[i].players[y].x_speed = 0;
      } else if(do_what == "bounce"){
        matchmaking.STARTED_GAMES[i].players[y].x_speed = matchmaking.STARTED_GAMES[i].players[y].x_speed*-1*10;
        if(matchmaking.STARTED_GAMES[i].players[y].x_speed > 12){
          matchmaking.STARTED_GAMES[i].players[y].x_speed = 12;
        }else if(matchmaking.STARTED_GAMES[i].players[y].x_speed < -12){
          matchmaking.STARTED_GAMES[i].players[y].x_speed = -12;
        }
        matchmaking.STARTED_GAMES[i].players[y].y_speed = -14;
        matchmaking.STARTED_GAMES[i].players[y].dir = 0;
        var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, matchmaking.STARTED_GAMES[i].players[y].socket.id);
        gameclock.sync(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player], matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer]);
      }
        if(matchmaking.STARTED_GAMES[i].players[y].dir != 0){
          if(matchmaking.STARTED_GAMES[i].players[y].x_speed < matchmaking.STARTED_GAMES[i].players[y].max_speed && matchmaking.STARTED_GAMES[i].players[y].x_speed > matchmaking.STARTED_GAMES[i].players[y].max_speed*-1){
            matchmaking.STARTED_GAMES[i].players[y].x_speed += matchmaking.STARTED_GAMES[i].players[y].dir * matchmaking.STARTED_GAMES[i].players[y].accerelation;
          }
        }
        if(matchmaking.STARTED_GAMES[i].players[y].x_speed > 0){
          if(matchmaking.STARTED_GAMES[i].players[y].y_speed == 0 ){
            matchmaking.STARTED_GAMES[i].players[y].x_speed -= matchmaking.STARTED_GAMES[i].players[y].friction;
          }
          matchmaking.STARTED_GAMES[i].players[y].x_speed -= (matchmaking.STARTED_GAMES[i].players[y].friction*1.5);
        }
        if(matchmaking.STARTED_GAMES[i].players[y].x_speed < 0){
          if(matchmaking.STARTED_GAMES[i].players[y].y_speed == 0 ){
            matchmaking.STARTED_GAMES[i].players[y].x_speed += matchmaking.STARTED_GAMES[i].players[y].friction;
          }
          matchmaking.STARTED_GAMES[i].players[y].x_speed += (matchmaking.STARTED_GAMES[i].players[y].friction*1.5);
        }
        if(matchmaking.STARTED_GAMES[i].players[y].x_speed < 1 && matchmaking.STARTED_GAMES[i].players[y].x_speed> -1){
          matchmaking.STARTED_GAMES[i].players[y].x_speed = 0;
          matchmaking.STARTED_GAMES[i].players[y].x_speed = 3*matchmaking.STARTED_GAMES[i].players[y].dir ;
        }
        matchmaking.STARTED_GAMES[i].players[y].x += matchmaking.STARTED_GAMES[i].players[y].x_speed;
      }
}
  };

exports.move_down = function(){
  var y_check = null;
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    for(var y = 0; y < 2; y++){
      if(matchmaking.STARTED_GAMES[i].players[y].y_speed < 0){
        y_check = check_head_collision(matchmaking.STARTED_GAMES[i].players[y]);
        if(!y_check){
          matchmaking.STARTED_GAMES[i].players[y].y+=matchmaking.STARTED_GAMES[i].players[y].y_speed;
          matchmaking.STARTED_GAMES[i].players[y].y_speed += matchmaking.STARTED_GAMES[i].players[y].gravity;
        }else{
          matchmaking.STARTED_GAMES[i].players[y].y=y_check;
           matchmaking.STARTED_GAMES[i].players[y].y_speed = 1;
        }
      }else{
        y_check = check_feet_collision(matchmaking.STARTED_GAMES[i].players[y]);
  if(y_check === false){
       matchmaking.STARTED_GAMES[i].players[y].y+=matchmaking.STARTED_GAMES[i].players[y].y_speed;
      if(matchmaking.STARTED_GAMES[i].players[y].y_speed < 17){
          matchmaking.STARTED_GAMES[i].players[y].y_speed += matchmaking.STARTED_GAMES[i].players[y].gravity;
       }
    }else{
       matchmaking.STARTED_GAMES[i].players[y].y=y_check;
        matchmaking.STARTED_GAMES[i].players[y].y_speed = 0;
        matchmaking.STARTED_GAMES[i].players[y].jumpready = true;
    }
  }
  if(matchmaking.STARTED_GAMES[i].players[y].y > 2000){
    if(y == 0){
      matchmaking.STARTED_GAMES[i].players[0].y = 100;
      matchmaking.STARTED_GAMES[i].players[0].x = 100;
      matchmaking.STARTED_GAMES[i].players[0].dir = 0;
    }else{
      matchmaking.STARTED_GAMES[i].players[1].y = 100;
      matchmaking.STARTED_GAMES[i].players[1].x = 1180;
      matchmaking.STARTED_GAMES[i].players[1].dir = 0;
    }
    gameclock.sync(matchmaking.STARTED_GAMES[i].players[0], matchmaking.STARTED_GAMES[i].players[1]);
  }
}
}
};

function check_feet_collision(player){
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, player.socket.id);
    if(player_collision(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player]) != "nothing" && matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].y < matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y){
      return matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y - matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].state.hitbox_H;
    }
  for(var i = 0; i < info.platforms.length; i++){
    if(player.x + (player.state.hitbox_W/2)  >= info.platforms[i].xstart && player.x - (player.state.hitbox_W/2) <= info.platforms[i].xend){
      if(player.y + player.y_speed>= info.platforms[i].y && player.y + player.y_speed <= info.platforms[i].y +  info.platforms[i].thickness){
        return info.platforms[i].y;
      }
    }
  }
  return false;
}

function check_head_collision(player){
  for(var i = 0; i < info.platforms.length; i++){
    if(info.platforms[i].thickness > 30){
      if(player.x + (player.state.hitbox_W/2) >= info.platforms[i].xstart && player.x - (player.state.hitbox_W/2) <= info.platforms[i].xend){
        if(player.y - player.state.hitbox_H + player.y_speed <= info.platforms[i].y + info.platforms[i].thickness && player.y - player.state.hitbox_H + player.y_speed >= info.platforms[i].y){
          return info.platforms[i].y+info.platforms[i].thickness+player.state.hitbox_H;
        }
      }
    }
  }
  return false;
}

function check_x_move(player){
  if(player_collision(player, 2) != "nothing" && player.x_speed != 0){
    return "stop";
  }
  for(var i = 0; i < info.walls.length; i++ ){
    if(player.x + (player.state.hitbox_W/2) + player.x_speed  >= info.walls[i].x && player.x - (player.state.hitbox_W/2) + player.x_speed  <= info.walls[i].x +info.walls[i].thickness ){
      if(player.y - player.state.hitbox_H <  info.walls[i].yend && player.y > info.walls[i].ystart){
        if(info.walls[i].bouncy){
          var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, player.socket.id);
          gameclock.sync(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player], matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer]);
        /*  matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].socket.emit('you_bounce');
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit('enemy_bounce');*/
          return "bounce";
        }else{
          return "stop";
        }
      }
    }
    }
  return "nothing";
}
/*exports.untangle = function(){
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    if(player_collision(matchmaking.STARTED_GAMES[i].players[0]) != "nothing"){
      if(matchmaking.STARTED_GAMES[i].players[0].y < matchmaking.STARTED_GAMES[i].players[0].y){
        matchmaking.STARTED_GAMES[i].players[0].y = matchmaking.STARTED_GAMES[i].players[1].y - matchmaking.STARTED_GAMES[i].players[1].state.hitbox_H-3;
        matchmaking.STARTED_GAMES[i].players[0].y_speed = 0;
        matchmaking.STARTED_GAMES[i].players[0].jumpready = true;
      }else{
        matchmaking.STARTED_GAMES[i].players[1].y = matchmaking.STARTED_GAMES[i].players[0].y - matchmaking.STARTED_GAMES[i].players[0].state.hitbox_H-3;
        matchmaking.STARTED_GAMES[i].players[1].y_speed = 0;
        matchmaking.STARTED_GAMES[i].players[0].jumpready = true;
      }
    }
  }
};*/
function player_collision(player, extra){
  if(!extra){
    extra = 0;
  }
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, player.socket.id);
  if(matchmaking.STARTED_GAMES[games_check.index]){
    if(player.x + (player.state.hitbox_W/2) + player.x_speed >= matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].x - (matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].state.hitbox_W)/2){
      if(player.x - (player.state.hitbox_W/2) + player.x_speed <= matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].x + (matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].state.hitbox_W)/2){
        if(player.y - player.state.hitbox_H + player.y_speed <=  matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y - extra){
          if(player.y + player.y_speed >=  matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y - matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].state.hitbox_H + extra){
              return {playery_feet: matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y, playery_head: matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y - matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].state.hitbox_H};
          }
        }
      }
    }
  }
  return "nothing";
}

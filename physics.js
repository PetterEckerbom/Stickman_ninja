var matchmaking = require('./matchmaking_server.js');
var info = require('./information.js');
var gameclock = require('./game_clock.js');
exports.move_players = function(){
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    for(var y = 0; y < 2; y++){
      var player = matchmaking.STARTED_GAMES[i].players[y];
      var do_what = check_x_move(player);
      if(do_what == "stop"){
        if(player.x_speed < 0){
          player.x += 10;
        }else{
          player.x -= 10;
        }
        player.x_speed = 0;
      } else if(do_what == "bounce"){
        player.x_speed = player.x_speed*-1*7;
        if(player.x_speed > 12){
          player.x_speed = 12;
        }else if(player.x_speed < -12){
          player.x_speed = -12;
        }
        player.y_speed = -12;
        player.dir = 0;
        var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, player.socket.id);
        gameclock.sync(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player], matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer]);
      }
        if(player.dir != 0){
          if(player.x_speed < player.max_speed && player.x_speed > player.max_speed*-1){
            player.x_speed += player.dir * player.accerelation;
          }
        }
        if(player.x_speed > 0){
          if(player.y_speed == 0 ){
            player.x_speed -= player.friction;
          }
          player.x_speed -= (player.friction*1.5);
        }
        if(player.x_speed < 0){
          if(player.y_speed == 0 ){
            player.x_speed += player.friction;
          }
          player.x_speed += (player.friction*1.5);
        }
        if(player.x_speed < 1 && player.x_speed> -1){
          player.x_speed = 0;
          player.x_speed = 3*player.dir ;
        }
        player.x += player.x_speed;
      }
}
  };

exports.move_down = function(){
  var y_check = null;
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    for(var y = 0; y < 2; y++){
      if(matchmaking.STARTED_GAMES[i].players[y].y_speed < 0){
        y_check = check_head_collision(matchmaking.STARTED_GAMES[i].players[y]);
        if(y_check === false){
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
  if(matchmaking.STARTED_GAMES[i].players[y].y > 1500){
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
    if(player_collision(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player]) != "nothing" && matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].y <= matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y){
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
  if(player_collision(player, 10) != "nothing" && player.x_speed != 0){
    return "stop";
  }
  for(var i = 0; i < info.walls.length; i++ ){
    if(player.x + (player.state.hitbox_W/2) + player.x_speed  >= info.walls[i].x && player.x - (player.state.hitbox_W/2) + player.x_speed  <= info.walls[i].x +info.walls[i].thickness ){
      if(player.y - player.state.hitbox_H <  info.walls[i].yend && player.y > info.walls[i].ystart){
        if(info.walls[i].bouncy){
          var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, player.socket.id);
          gameclock.sync(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player], matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer]);
          return "bounce";
        }else{
          return "stop";
        }
      }
    }
    }
  return "nothing";
}

function player_collision(player, extra){
  if(!extra){
    extra = 0;
  }
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, player.socket.id);
  if(matchmaking.STARTED_GAMES[games_check.index]){
    if(player.x + (player.state.hitbox_W/2) + extra + player.x_speed >= matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].x - (matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].state.hitbox_W)/2 - extra + matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].x_speed){
      if(player.x - (player.state.hitbox_W/2) - extra + player.x_speed <= matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].x + (matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].state.hitbox_W)/2 + extra + matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].x_speed){
        if(player.y - player.state.hitbox_H + player.y_speed <=  matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y + matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y_speed - extra){
          if(player.y + player.y_speed >=  matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y - matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].state.hitbox_H + matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y_speed + extra){
              return {playery_feet: matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y, playery_head: matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].y - matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].state.hitbox_H};
          }
        }
      }
    }
  }
  return "nothing";
}

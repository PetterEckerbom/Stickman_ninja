var matchmaking = require('./matchmaking_server.js');
var gameclock = require('./game_clock.js');

exports.move_change = function(socket, dir){
  if(dir > 1 || dir < -1){
    return;
  }
  	var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
      if(games_check != -1){
        if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].dir != dir && matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].controlE){
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
    }
  }
};

exports.ping = function(){
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    var d = new Date();
    var time = d.getTime();
    var id = Math.random();
    var id2 = Math.random();
    matchmaking.STARTED_GAMES[i].players[0].Ptime[id] = time;
    matchmaking.STARTED_GAMES[i].players[1].Ptime[id2] = time;
    matchmaking.STARTED_GAMES[i].players[0].socket.emit('ping', {id:id,ping:matchmaking.STARTED_GAMES[i].players[0].ping});
    matchmaking.STARTED_GAMES[i].players[1].socket.emit('ping', {id:id2,ping:matchmaking.STARTED_GAMES[i].players[1].ping});
  }
};

exports.punch = function(socket){
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(games_check != -1){
      if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].controlE){
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].controlE = false;
        setTimeout(control_ready, 4000/10, games_check.index, games_check.Player);
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].socket.emit("punch", 0);
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit("punch", 1);
        var hitcords;
        var dir;
      if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].facing == "left"){
        //matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].x_speed = -5;
        hitcords = {x: matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].x - (120/3), y:matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].y-(205/3)};
        dir = -1;
      }else{
        //matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].x_speed = 5;
        hitcords = {x: matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].x + (120/3), y:matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].y-(205/3)};
        dir = 1;
      }
	  if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].y_speed == 0){
		matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].x_speed = 0;  
	  }
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].dir = 0;
        if(games_check.NotPlayer == 0){
            setTimeout(check_hit, 2000/15, games_check.index, games_check.NotPlayer, hitcords,dir,1);
        }else{
          setTimeout(check_hit, 2000/15, games_check.index, games_check.NotPlayer, hitcords,dir,0);
        }
      }
    }
};
function attack_ready(game_instance, player){
  matchmaking.STARTED_GAMES[game_instance].players[player].attackready = true;
}
function control_ready(game_instance, player){
	matchmaking.STARTED_GAMES[game_instance].players[player].controlE = true;
}
function check_hit(game_instance, player, hitcords,dir,other){
  //console.log(hitcords.x > matchmaking.STARTED_GAMES[game_instance].players[player].x - (matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_W/2) && hitcords.x < matchmaking.STARTED_GAMES[game_instance].players[player].x + (matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_W/2));
	//console.log(matchmaking.STARTED_GAMES[game_instance].players[other].attackready)
	if(matchmaking.STARTED_GAMES[game_instance].players[other].attackready){
	  if(hitcords.x > matchmaking.STARTED_GAMES[game_instance].players[player].x - (matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_W) && hitcords.x < matchmaking.STARTED_GAMES[game_instance].players[player].x + (matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_W)){
		if(hitcords.y > matchmaking.STARTED_GAMES[game_instance].players[player].y - matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_H && hitcords.y < matchmaking.STARTED_GAMES[game_instance].players[player].y){
		  matchmaking.STARTED_GAMES[game_instance].players[player].x_speed = dir*9;
		  matchmaking.STARTED_GAMES[game_instance].players[player].controlE = false;
		  		matchmaking.STARTED_GAMES[game_instance].players[player].attackready = false;
			setTimeout(control_ready, 4000/15, game_instance, player);
			setTimeout(attack_ready, 4000/15, game_instance, player);
		  gameclock.sync(matchmaking.STARTED_GAMES[game_instance].players[player], matchmaking.STARTED_GAMES[game_instance].players[other]);
		}
	  }
	}
}

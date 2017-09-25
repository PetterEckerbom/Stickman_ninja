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
  var time;
  if(games_check != -1){
      if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].controlE && matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].attackready){
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].controlE = false;
        setTimeout(control_ready, 6000/10, games_check.index, games_check.Player);
        if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].punch.punch2){
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].socket.emit("punch", {player:0, type:3});
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit("punch", {player:1, type:3});
          time = 7000/10;
        }else if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].punch.punch1){
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].socket.emit("punch", {player:0, type:2});
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit("punch", {player:1, type:2});
          time = 7000/10;
        }else{
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].socket.emit("punch", {player:0, type:1});
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit("punch", {player:1, type:1});
          time = 2000/15;
        }
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
            setTimeout(check_hit, time, games_check.index, games_check.NotPlayer, hitcords,dir,1);
        }else{
          setTimeout(check_hit, time, games_check.index, games_check.NotPlayer, hitcords,dir,0);
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
function reset_punch(game_instance, player, punch){
    matchmaking.STARTED_GAMES[game_instance].players[player].punch[punch] = false;
}
function check_hit(game_instance, player, hitcords,dir,other){
  var time = 0;
  var foce = 0;
  var type = "";
  //console.log(hitcords.x > matchmaking.STARTED_GAMES[game_instance].players[player].x - (matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_W/2) && hitcords.x < matchmaking.STARTED_GAMES[game_instance].players[player].x + (matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_W/2));
	//console.log(matchmaking.STARTED_GAMES[game_instance].players[other].attackready)
	if(matchmaking.STARTED_GAMES[game_instance].players[other].attackready){
	  if(hitcords.x > matchmaking.STARTED_GAMES[game_instance].players[player].x - (matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_W) && hitcords.x < matchmaking.STARTED_GAMES[game_instance].players[player].x + (matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_W)){
		if(hitcords.y > matchmaking.STARTED_GAMES[game_instance].players[player].y - matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_H && hitcords.y < matchmaking.STARTED_GAMES[game_instance].players[player].y){
      if(matchmaking.STARTED_GAMES[game_instance].players[other].punch.punch2){
        matchmaking.STARTED_GAMES[game_instance].players[other].punch.punch1 = false;
        matchmaking.STARTED_GAMES[game_instance].players[other].punch.punch2 = false;
        force = 15;
        time = 16000;
        type = "hit3";
      }else if(matchmaking.STARTED_GAMES[game_instance].players[other].punch.punch1){
        matchmaking.STARTED_GAMES[game_instance].players[other].punch.punch2 = true;
        setTimeout(reset_punch, 2500, game_instance, other, "punch2");
        force = 10;
        time = 12000;
        type = "hit2";
      }else{
        matchmaking.STARTED_GAMES[game_instance].players[other].punch.punch1 = true;
        setTimeout(reset_punch, 2500, game_instance, other, "punch1");
        force = 9;
        time = 12000;
        type = "hit1";
      }
      matchmaking.STARTED_GAMES[game_instance].players[player].x_speed = dir*force;
		  matchmaking.STARTED_GAMES[game_instance].players[player].controlE = false;
		  matchmaking.STARTED_GAMES[game_instance].players[player].attackready = false;
		  matchmaking.STARTED_GAMES[game_instance].players[player].dir = 0;
			setTimeout(control_ready, time/15, game_instance, player);
			setTimeout(attack_ready, time/5, game_instance, player);
		  gameclock.sync(matchmaking.STARTED_GAMES[game_instance].players[player], matchmaking.STARTED_GAMES[game_instance].players[other]);
      matchmaking.STARTED_GAMES[game_instance].players[player].socket.emit(type,"you");
      matchmaking.STARTED_GAMES[game_instance].players[other].socket.emit(type,"enemy");
		}
	  }
	}
}

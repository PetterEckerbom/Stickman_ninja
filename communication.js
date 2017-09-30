var matchmaking = require('./matchmaking_server.js');
var gameclock = require('./game_clock.js');
var info = require('./information.js');

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
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].socket.emit('flipping', 0);
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit('flipping', 1);
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].jumpready = false;
      }
      if(boostedjump(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player])){
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].y_speed = -12.5;
      }else{
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].y_speed = -9;
      }
      gameclock.sync(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player], matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer]);
    }
  }
};

function boostedjump(player){
  for(var i = 0; i < info.jumppad.length; i++){
    if(player.x + (player.state.hitbox_W/2) >= info.jumppad[i].x && player.x - (player.state.hitbox_W/2) <= info.jumppad[i].x + info.jumppad[i].width && player.y == info.jumppad[i].y){
      return true;
    }
  }
  return false;
}

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
  var type;
  if(games_check != -1){
      if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].controlE && matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].attackready){
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].controlE = false;
        setTimeout(control_ready, 6000/10, games_check.index, games_check.Player);
        if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].punch.punch2){
          type = 3;
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].socket.emit("punch", {player:0, type:3});
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit("punch", {player:1, type:3});
          time = 7000/10;
        }else if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].punch.punch1){
          type = 2;
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].socket.emit("punch", {player:0, type:2});
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit("punch", {player:1, type:2});
          time = 7000/10;
        }else{
          type = 1;
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].socket.emit("punch", {player:0, type:1});
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit("punch", {player:1, type:1});
          time = 2000/15;
        }
        var hitcords;
        var dir;
        if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].y_speed == 0){
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].x_speed = 0;
        }
        if(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].facing == "left"){
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].x_speed = (2 * type + 2) * -1;
          dir = -1;
        }else{
          dir = 1;
          matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].x_speed = 2*type + 2;
        }
        matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player].dir = 0;
        if(games_check.NotPlayer == 0){
            setTimeout(check_hit, time, games_check.index, games_check.NotPlayer, dir, 1, type);
        }else{
          setTimeout(check_hit, time, games_check.index, games_check.NotPlayer, dir, 0, type);
        }
      }
    }
};
function attack_ready(game_instance, player){
  if(matchmaking.STARTED_GAMES[game_instance]){
    matchmaking.STARTED_GAMES[game_instance].players[player].attackready = true;
  }
}
function control_ready(game_instance, player){
  if(matchmaking.STARTED_GAMES[game_instance]){
  	matchmaking.STARTED_GAMES[game_instance].players[player].controlE = true;
  }
}
function reset_punch(game_instance, player, punch){
  if(matchmaking.STARTED_GAMES[game_instance]){
    matchmaking.STARTED_GAMES[game_instance].players[player].punch[punch] = false;
  }
}
function check_hit(game_instance, player, dir, other, Ptype){
  var hitcords;
  var time = 0;
  var foce = 0;
  var type = "";
  //console.log(hitcords.x > matchmaking.STARTED_GAMES[game_instance].players[player].x - (matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_W/2) && hitcords.x < matchmaking.STARTED_GAMES[game_instance].players[player].x + (matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_W/2));
	//console.log(matchmaking.STARTED_GAMES[game_instance].players[other].attackready)
  if(matchmaking.STARTED_GAMES[game_instance]){
    hitcords = get_punch_cords(game_instance, other, Ptype);
  	if(matchmaking.STARTED_GAMES[game_instance].players[other].attackready){
  	  if(hitcords.x > matchmaking.STARTED_GAMES[game_instance].players[player].x - (matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_W) && hitcords.x < matchmaking.STARTED_GAMES[game_instance].players[player].x + (matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_W)){
  		if(hitcords.y > matchmaking.STARTED_GAMES[game_instance].players[player].y - matchmaking.STARTED_GAMES[game_instance].players[player].state.hitbox_H && hitcords.y < matchmaking.STARTED_GAMES[game_instance].players[player].y){
        if(Ptype == 3){
          matchmaking.STARTED_GAMES[game_instance].players[other].punch.punch1 = false;
          matchmaking.STARTED_GAMES[game_instance].players[other].punch.punch2 = false;
          force = 15;
          time = 16000;
          type = "hit3";
        }else if(Ptype == 2){
          matchmaking.STARTED_GAMES[game_instance].players[other].punch.punch2 = true;
          setTimeout(reset_punch, 5000, game_instance, other, "punch2");
          force = 10;
          time = 12000;
          type = "hit2";
        }else{
          matchmaking.STARTED_GAMES[game_instance].players[other].punch.punch1 = true;
          setTimeout(reset_punch, 5000, game_instance, other, "punch1");
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
}

function get_punch_cords(game, player, punchtype){
  var hitcords = {};
  var x_dist = 0;
  if(punchtype == 1){
    x_dist = 120;
  }else if(punchtype == 2){
    x_dist = 150;
  }else if(punchtype == 3){
    x_dist = 200;
  }
  if(matchmaking.STARTED_GAMES[game].players[player].facing == "left"){
    hitcords = {x: matchmaking.STARTED_GAMES[game].players[player].x - (x_dist/3), y:matchmaking.STARTED_GAMES[game].players[player].y-(205/3)};
  }else{
    hitcords = {x: matchmaking.STARTED_GAMES[game].players[player].x + (x_dist/3), y:matchmaking.STARTED_GAMES[game].players[player].y-(205/3)};
  }
  return hitcords;
}

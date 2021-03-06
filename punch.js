//This file handels everything punch related, this is not simple enought to go in playeractions.js altho it is a player action
var matchmaking = require('./matchmaking_server.js');
var gameclock = require('./game_clock.js');
var physics = require('./physics.js');

exports.punch = function(socket, airkick){
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  var time;
  var type;
  if(games_check != -1){
    if(matchmaking.STARTED_GAMES[games_check.index]){
    var player = matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player];
    var OtherPlayer = matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer];
    //If player has control over character aswell as not having punch on cooldown we send it through.
      if(player.controlE && player.attackready){
        //We disable control of character for 0.6s
        player.controlE = false;
        player.controlstack++;
        setTimeout(control_ready, 6000/10, games_check.index, games_check.Player);
        //Below we check what kind of punch it is that sould be sent. Done through two booleans in an object stored in player object.
        if(airkick){
          type = 4;
          player.socket.emit("airkick", 0);
          OtherPlayer.socket.emit("airkick", 1);
          time = 3000/15;
        }else if(player.punch.punch2){
          type = 3;
          player.socket.emit("punch", {player:0, type:3});
          OtherPlayer.socket.emit("punch", {player:1, type:3});
          time = 6000/10;
        }else if(player.punch.punch1){
          type = 2;
          player.socket.emit("punch", {player:0, type:2});
          OtherPlayer.socket.emit("punch", {player:1, type:2});
          time = 6000/10;
        }else{
          type = 1;
          player.socket.emit("punch", {player:0, type:1});
          OtherPlayer.socket.emit("punch", {player:1, type:1});
          time = 2000/15;
        }

        var dir;
        if(player.y_speed == 0 && !airkick){
          player.x_speed = 0;
        }
        //We sents his speed depending on punch typer and facing direction, we also define what direction the punch is in
        if(player.facing == "left"){
          if(!airkick){
            player.x_speed = (2 * type + 2) * -1;
          }
          dir = -1;
        }else{
          dir = 1;
          if(!airkick){
            player.x_speed = 2*type + 2;
          }
        }
        //We set player movement direction to 0 as to avoid the pysics.js move_players() to move him.
        if(!airkick){
          player.dir = 0;
        }
        //We call hitfunction after the time it takes for punch to hit, we send through direction and both player postition in array.
        if(games_check.NotPlayer == 0){
            setTimeout(check_hit, time, games_check.index, games_check.NotPlayer, dir, 1, type);
        }else{
          setTimeout(check_hit, time, games_check.index, games_check.NotPlayer, dir, 0, type);
        }
      }
    }
  }
};

//The below functions are for Resettting diffrent booleans such as movement, hit and the two diffrent pucnh booleans
function attack_ready(game_instance, player){
  if(matchmaking.STARTED_GAMES[game_instance]){
  matchmaking.STARTED_GAMES[game_instance].players[player].attackstack--;
  if(matchmaking.STARTED_GAMES[game_instance].players[player].attackstack <= 0){
    matchmaking.STARTED_GAMES[game_instance].players[player].attackready = true;
    matchmaking.STARTED_GAMES[game_instance].players[player].attackstack = 0;
  }
  }
}
function control_ready(game_instance, player){
  if(matchmaking.STARTED_GAMES[game_instance]){
    matchmaking.STARTED_GAMES[game_instance].players[player].controlstack--;
    if(matchmaking.STARTED_GAMES[game_instance].players[player].controlstack <= 0){
    	matchmaking.STARTED_GAMES[game_instance].players[player].controlE = true;
      matchmaking.STARTED_GAMES[game_instance].players[player].controlstack = 0;
    }
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
  //Checks if game still exist, after all this function is called after some time and player could have disconnected
  if(matchmaking.STARTED_GAMES[game_instance]){
    //find the cordinates where the hit lands
    hitcords = get_punch_cords(game_instance, other, Ptype);
    var hit_player = matchmaking.STARTED_GAMES[game_instance].players[player];
    var hitting_player = matchmaking.STARTED_GAMES[game_instance].players[other];
    //if player is ready to hit attack and coordinates match up we send through
  	if(hitting_player.attackready){
  	  if(hitcords.x > hit_player.x - (hit_player.state.hitbox_W) && hitcords.x < hit_player.x + (hit_player.state.hitbox_W)){
  		if(hitcords.y > hit_player.y - hit_player.state.hitbox_H && hitcords.y < hit_player.y){
        //We check what kind of hit it is and apply correct values to the vars.
        if(Ptype == 4){
          force = 7;
          time = 10000;
          type = "hit1";
          matchmaking.decrese_health(hit_player, 175);
          matchmaking.fame_increase(hitting_player, 100);
        }else if(Ptype == 3){
          hitting_player.punch.punch1 = false;
          hitting_player.punch.punch2 = false;
          force = 15;
          time = 19000;
          type = "hit3";
          matchmaking.decrese_health(hit_player, 300);
          matchmaking.fame_increase(hitting_player, 400);
          if(dir == -1){
            hit_player.facing = "right";
          }else{
            hit_player.facing = "left";
          }
        }else if(Ptype == 2){
          //We set punch2 ready for 5s and then removes it, this gives a 5s window to hit third hit for max power
          hitting_player.punch.punch2 = true;
          setTimeout(reset_punch, 5000, game_instance, other, "punch2");
          force = 10;
          time = 12000;
          type = "hit2";
          matchmaking.decrese_health(hit_player, 150);
          matchmaking.fame_increase(hitting_player, 100);
        }else{
          //same here 5s to hit next value
          hitting_player.punch.punch1 = true;
          setTimeout(reset_punch, 5000, game_instance, other, "punch1");
          force = 9;
          time = 12000;
          type = "hit1";
          matchmaking.decrese_health(hit_player, 100);
          matchmaking.fame_increase(hitting_player, 60);
        }
        //We apply the hit to players speed and makes him lose control of character
        hit_player.x_speed = dir*force;
        hit_player.controlstack++;
  		  hit_player.controlE = false;
        hit_player.attackstack++;
  		  hit_player.attackready = false;
  		  hit_player.dir = 0;
  			setTimeout(control_ready, time/15, game_instance, player);
  			setTimeout(attack_ready, time/5, game_instance, player);
        //We sync clients with server  in order for it to have accurated hit calculateions
  		  gameclock.sync(hit_player, hitting_player);
        //We let players know a player got hit so they can apply animations and shit.
        hit_player.socket.emit(type, {player:0,dir:dir});
        hitting_player.socket.emit(type, {player:1,dir:dir});
  		}
  	  }
  	}
  }
}

//The function below takes the type of punch and a player position and calculates where the punch hits (Where the arm is when the puch hits)
function get_punch_cords(game, player, punchtype){
  var hitcords = {};
  var x_dist = 0;
  var y_dist = 205;
  if(punchtype == 1){
    x_dist = 120;
  }else if(punchtype == 2){
    x_dist = 150;
  }else if(punchtype == 3){
    x_dist = 200;
  }else if(punchtype == 4){
    x_dist = 120;
    y_dist = 100;
  }
  if(matchmaking.STARTED_GAMES[game].players[player].facing == "left"){
    hitcords = {x: matchmaking.STARTED_GAMES[game].players[player].x - (x_dist/3), y:matchmaking.STARTED_GAMES[game].players[player].y-(y_dist/3)};
  }else{
    hitcords = {x: matchmaking.STARTED_GAMES[game].players[player].x + (x_dist/3), y:matchmaking.STARTED_GAMES[game].players[player].y-(y_dist/3)};
  }
  return hitcords;
}


exports.swipe_kick = function(socket){
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  var time;
  if(games_check != -1){
    if(matchmaking.STARTED_GAMES[games_check.index]){
    var player = matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player];
    var OtherPlayer = matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer];
    //If player has control over character aswell as not having punch on cooldown we send it through.
      if(player.controlE && player.attackready){
        //We disable control of character for 0.6s
        player.controlE = false;
        player.controlstack++;
        setTimeout(control_ready, 6000/10, games_check.index, games_check.Player);
        //Below we check what kind of punch it is that sould be sent. Done through two booleans in an object stored in player object.
        player.socket.emit("swipe_kick", 0);
        OtherPlayer.socket.emit("swipe_kick", 1);
        time = 2000/15;
        var dir;
        if(player.y_speed == 0){
          player.x_speed = 0;
        }
        //We sents his speed depending on punch typer and facing direction, we also define what direction the punch is in
        if(player.facing == "left"){
          dir = -1;
        }else{
          dir = 1;
        }
        //We set player movement direction to 0 as to avoid the pysics.js move_players() to move him.
        player.dir = 0;
        //We call hitfunction after the time it takes for punch to hit, we send through direction and both player postition in array.
        if(games_check.NotPlayer == 0){
          setTimeout(check_hit_swipe, 300, games_check.index, games_check.NotPlayer, dir, 1);
        }else{
          setTimeout(check_hit_swipe, 300, games_check.index, games_check.NotPlayer, dir, 0);
        }
      }
    }
  }
};

function check_hit_swipe(game, player, dir, other){
  if(matchmaking.STARTED_GAMES[game]){
    var hit_player = matchmaking.STARTED_GAMES[game].players[player];
    var hitting_player = matchmaking.STARTED_GAMES[game].players[other];
    var hitcords = {x: matchmaking.STARTED_GAMES[game].players[other].x + ((200/3)*dir), y:matchmaking.STARTED_GAMES[game].players[other].y-(40)};
  //if player is ready to hit attack and coordinates match up we send through
  if(hitting_player.attackready && !hit_player.fallen){
      if(hitcords.x > hit_player.x - (hit_player.state.hitbox_W) && hitcords.x < hit_player.x + (hit_player.state.hitbox_W)){
        if(hitcords.y > hit_player.y - hit_player.state.hitbox_H && hitcords.y < hit_player.y){
          hit_player.controlstack++;
    		  hit_player.controlE = false;
          hit_player.attackstack++;
    		  hit_player.attackready = false;
    		  hit_player.dir = 0;
    			setTimeout(control_ready, 1000, game, player);
    			setTimeout(attack_ready, 1000, game, player);
          matchmaking.decrese_health(hit_player, 150);
          //We sync clients with server  in order for it to have accurated hit calculateions
    		  gameclock.sync(hit_player, hitting_player);
          //We let players know a player got hit so they can apply animations and shit.
          hit_player.socket.emit("fall", 0);
          hitting_player.socket.emit("fall", 1);
          hit_player.fallen = true;
          setTimeout(up, 1440, game, hit_player);
        }
      }
    }
  }
}
function up(game, player){
  if(matchmaking.STARTED_GAMES[game]){
    player.fallen = false;
  }
}
exports.kick_down = function(socket){
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(games_check != -1){
    if(matchmaking.STARTED_GAMES[games_check.index]){
    var player = matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player];
    var OtherPlayer = matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer];
    //If player has control over character aswell as not having punch on cooldown we send it through.
      if(player.controlE && player.attackready){
        //We disable control of character for 0.6s
        player.controlE = false;
        player.controlstack++;
        setTimeout(control_ready, 600, games_check.index, games_check.Player);
        //We set player movement direction to 0 as to avoid the pysics.js move_players() to move him.
        player.dir = 0;
        player.socket.emit('kickdown', 0);
        OtherPlayer.socket.emit('kickdown', 1);
        //We call hitfunction after the time it takes for punch to hit, we send through direction and both player postition in array.
        if(games_check.NotPlayer == 0){
            setTimeout(check_down_kick, 100, games_check.index, games_check.NotPlayer, 1);
        }else{
          setTimeout(check_down_kick, 100, games_check.index, games_check.NotPlayer, 0);
        }
      }
    }
  }
};

function check_down_kick(game_instance, player, other){
  if(matchmaking.STARTED_GAMES[game_instance]){
    var hit_player = matchmaking.STARTED_GAMES[game_instance].players[player];
    var hitting_player = matchmaking.STARTED_GAMES[game_instance].players[other];
    var hit_x = hitting_player.x;
    var hit_y = hitting_player.y + 50;
    if(hitting_player.attackready){
      if(hit_x > hit_player.x - (hit_player.state.hitbox_W/2) && hit_x < hit_player.x + (hit_player.state.hitbox_W/2)){
        if(hit_y > hit_player.y - hit_player.state.hitbox_H && hit_y < hit_player.y){
          hit_player.y_speed = 14;
          matchmaking.decrese_health(hit_player, 100);
          gameclock.sync(hit_player, hitting_player);
        }
      }
    }
  }
}

exports.punch_up = function(socket){
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(games_check != -1){
    if(matchmaking.STARTED_GAMES[games_check.index]){
    var player = matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player];
    var OtherPlayer = matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer];
    //If player has control over character aswell as not having punch on cooldown we send it through.
      if(player.controlE && player.attackready){
        player.socket.emit('puch_up',0);
        OtherPlayer.socket.emit('puch_up',1);
        //We disable control of character for 0.6s
        player.controlE = false;
        player.controlstack++;
        setTimeout(control_ready, 600, games_check.index, games_check.Player);
        //We set player movement direction to 0 as to avoid the pysics.js move_players() to move him.
        player.dir = 0;
        //We call hitfunction after the time it takes for punch to hit, we send through direction and both player postition in array.
        if(games_check.NotPlayer == 0){
            setTimeout(check_up_punch, 300, games_check.index, games_check.NotPlayer, 1);
        }else{
          setTimeout(check_up_punch, 300, games_check.index, games_check.NotPlayer, 0);
        }
      }
    }
  }
};

function check_up_punch(game_instance, player, other){
  if(matchmaking.STARTED_GAMES[game_instance]){
    var hit_player = matchmaking.STARTED_GAMES[game_instance].players[player];
    var hitting_player = matchmaking.STARTED_GAMES[game_instance].players[other];
    var hit_x = hitting_player.x;
    var hit_y = hitting_player.y - hitting_player.state.hitbox_H - 10;
    if(hitting_player.attackready){
      if(hit_x > hit_player.x - (hit_player.state.hitbox_W/2) && hit_x < hit_player.x + (hit_player.state.hitbox_W/2)){
        if(hit_y > hit_player.y - hit_player.state.hitbox_H && hit_y < hit_player.y){
          hit_player.y_speed = -13;
          matchmaking.decrese_health(hit_player, 50);
          gameclock.sync(hit_player, hitting_player);
        }
      }
    }
  }
}

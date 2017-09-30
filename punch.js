//This file handels everything punch related, this is not simple enought to go in playeractions.js altho it is a player action
var matchmaking = require('./matchmaking_server.js');
var gameclock = require('./game_clock.js');

exports.punch = function(socket){
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  var time;
  var type;
  if(games_check != -1){
    var player = matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player];
    var OtherPlayer = matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer];
    //If player has control over character aswell as not having punch on cooldown we send it through.
      if(player.controlE && player.attackready){
        //We disable control of character for 0.6s
        player.controlE = false;
        setTimeout(control_ready, 6000/10, games_check.index, games_check.Player);
        //Below we check what kind of punch it is that sould be sent. Done through two booleans in an object stored in player object.
        if(player.punch.punch2){
          type = 3;
          player.socket.emit("punch", {player:0, type:3});
          OtherPlayer.socket.emit("punch", {player:1, type:3});
          time = 7000/10;
        }else if(player.punch.punch1){
          type = 2;
          player.socket.emit("punch", {player:0, type:2});
          OtherPlayer.socket.emit("punch", {player:1, type:2});
          time = 7000/10;
        }else{
          type = 1;
          player.socket.emit("punch", {player:0, type:1});
          OtherPlayer.socket.emit("punch", {player:1, type:1});
          time = 2000/15;
        }

        var dir;
        if(player.y_speed == 0){
          //if he is standing on ground we stop his movement for the punch
        player.x_speed = 0;
        }
        //We sents his speed depending on punch typer and facing direction, we also define what direction the punch is in
        if(player.facing == "left"){
          player.x_speed = (2 * type + 2) * -1;
          dir = -1;
        }else{
          dir = 1;
          player.x_speed = 2*type + 2;
        }
        //We set player movement direction to 0 as to avoid the pysics.js move_players() to move him.
        player.dir = 0;
        //We call hitfunction after the time it takes for punch to hit, we send through direction and both player postition in array.
        if(games_check.NotPlayer == 0){
            setTimeout(check_hit, time, games_check.index, games_check.NotPlayer, dir, 1, type);
        }else{
          setTimeout(check_hit, time, games_check.index, games_check.NotPlayer, dir, 0, type);
        }
      }
    }
};

//The below functions are for Resettting diffrent booleans such as movement, hit and the two diffrent pucnh booleans
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
        if(Ptype == 3){
          hitting_player.punch.punch1 = false;
          hitting_player.punch.punch2 = false;
          force = 15;
          time = 16000;
          type = "hit3";
        }else if(Ptype == 2){
          //We set punch2 ready for 5s and then removes it, this gives a 5s window to hit third hit for max power
          hitting_player.punch.punch2 = true;
          setTimeout(reset_punch, 5000, game_instance, other, "punch2");
          force = 10;
          time = 12000;
          type = "hit2";
        }else{
          //same here 5s to hit next value
          hitting_player.punch.punch1 = true;
          setTimeout(reset_punch, 5000, game_instance, other, "punch1");
          force = 9;
          time = 12000;
          type = "hit1";
        }
        //We apply the hit to players speed and makes him lose control of character
        hit_player.x_speed = dir*force;
  		  hit_player.controlE = false;
  		  hit_player.attackready = false;
  		  hit_player.dir = 0;
  			setTimeout(control_ready, time/15, game_instance, player);
  			setTimeout(attack_ready, time/5, game_instance, player);
        //We sync clients with server  in order for it to have accurated hit calculateions
  		  gameclock.sync(hit_player, hitting_player);
        //We let players know a player got hit so they can apply animations and shit.
        hit_player.socket.emit(type,"you");
        hitting_player.socket.emit(type,"enemy");
  		}
  	  }
  	}
  }
}

//The function below takes the type of punch and a player position and calculates where the punch hits (Where the arm is when the puch hits)
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

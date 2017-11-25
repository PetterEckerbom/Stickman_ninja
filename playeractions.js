//This file is for simple player actions such as jumping or direction change
var matchmaking = require('./matchmaking_server.js');
var gameclock = require('./game_clock.js');
var info = require('./information.js');

exports.move_change = function(socket, dir){
  //Makes sure only values between -1 and 1 can pass through.
  if(dir > 1 || dir < -1){
    return;
  }
  	var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
      if(games_check != -1){
        var player = matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player];
        var OtherPlayer = matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer];

        //If player havae control of their character and its a new direction we sync and chnage direction
        if(player.dir != dir && player.controlE){
          gameclock.sync(player, OtherPlayer);
          player.dir = dir;
          //We tell clients that a character have changed direction
          player.socket.emit('Change_direction_you', dir);
          OtherPlayer.socket.emit('Change_direction_enemy', dir);
          //We face character appropriate direction, this is needed for pucnhes and such.
          if(dir == 1){
            player.facing = "right";
          }
          if(dir == -1){
            player.facing = "left";
          }
        }
      }
};

exports.jump = function(socket){
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(games_check != -1){
    var player = matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player];
    var OtherPlayer = matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer];

    if(player.jumpready){
      //If charcter is already in air we makes sure ha cant jump again and tells client that it was a flipjump
      if(player.y_speed != 0){
        player.socket.emit('flipping', 0);
        OtherPlayer.socket.emit('flipping', 1);
        player.jumpready = false;
      }
      //If player stand on a boosterplate he jumps ~140% higher
      if(boostedjump(player) || player.wings){
        player.y_speed = -12.5;
      }else{
        player.y_speed = -9;
      }
      //sync client and server in order for clinet to know that a jump has occured
      gameclock.sync(player, OtherPlayer);
    }
  }
};

//Checks if a player is standing on a jumppad.
function boostedjump(player){
  for(var i = 0; i < info.jumppad.length; i++){
    if(player.x + (player.state.hitbox_W/2) >= info.jumppad[i].x && player.x - (player.state.hitbox_W/2) <= info.jumppad[i].x + info.jumppad[i].width && player.y == info.jumppad[i].y){
      return true;
    }
  }
  return false;
}

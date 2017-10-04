/*
This is the pysics engien, everything related to movement is in here. very simular code is also found in the client
in the file game.js since the client does the axact same thing as the server but idependently. that code is not as
well commeneted as this code is howerver so if someting cant be understood please read here instead
*/

var matchmaking = require('./matchmaking_server.js');
var info = require('./information.js');
var gameclock = require('./game_clock.js');
var punch = require('./punch.js');
var physics = require('./physics.js');
exports.move_players = function(){
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    for(var y = 0; y < 2; y++){
      var player = matchmaking.STARTED_GAMES[i].players[y];
      //check_x_move return a statement of what will happen if a player moves in the direction it is about to move in
      var do_what = check_x_move(player);

      if(do_what == "stop"){
        //We stop the players and puch them back a few pixels so they wont get stuck or keep running into the same obsticle
        if(player.x_speed < 0){
          player.x += 10;
        }else{
          player.x -= 10;
        }
        player.x_speed = 0;
      } else if(do_what == "bounce"){
        //We invert and boost the x_speed but still makes sure it doesn't go over 12
        player.x_speed = player.x_speed*-1*7;
        if(player.x_speed > 12){
          player.x_speed = 12;
        }else if(player.x_speed < -12){
          player.x_speed = -12;
        }
        player.y_speed = -12;
        //Sets the direction to 0 so the players wont run back where they came from and syncs up client and server.
        player.dir = 0;
        var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, player.socket.id);
        gameclock.sync(matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player], matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer]);
      }
      //If check_x_move doesn't find any obsicles we add the accerelation to their speed.
        if(player.dir != 0){
          if(player.x_speed < player.max_speed && player.x_speed > player.max_speed*-1){
            player.x_speed += player.dir * player.accerelation;
          }
        }
        //We also add some friction, more friction if they stand on ground aka y_speed == 0
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
        //We cut off speed when it is less than 1 from 0;
        if(player.x_speed < 1 && player.x_speed> -1){
          player.x_speed = 0;
          player.x_speed = 3*player.dir ;
        }
        //we add the speed to the players x;
        player.x += player.x_speed;
      }
}
  };

exports.move_down = function(){
  var y_check;
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    for(var y = 0; y < 2; y++){
      var player = matchmaking.STARTED_GAMES[i].players[y];

      if(player.y_speed < 0){
        //if player is moving up we check so his head is not bumping into any platforms.
        y_check = check_head_collision(player);
        if(y_check === false){
          //If he is not we simply move him as fast as y_speed is and decrese his y_speed with gravity.
          player.y+=player.y_speed;
          player.y_speed += player.gravity;
        }else{
          //if he is about to bump his head we set his y to the place where he is about to bump his head and sets his y_speed to a slow speed downwards
          player.y=y_check;
          //Negative speeds are UP and Posetive speeds are DOWN due to canvas working that way
           player.y_speed = 1;
        }
      }else{
        //If he is moving down we instead check his feet
        y_check = check_feet_collision(player);
  if(y_check === false){
    //if nothing is about to happen we increase y with y_speed and assuming we are not going to fast we increase y_speed with gravity
       player.y+=player.y_speed;
      if(player.y_speed < 17){
          player.y_speed += player.gravity;
       }
    }else{
      //if he makes contact with ground we set his y cord to ground and sets speed to 0, also makes sure he can jump again
       player.y=y_check.y;
        player.y_speed = 0;
        player.jumpready = true;
        if(y_check.sync){
          gameclock.sync(matchmaking.STARTED_GAMES[i].players[0], matchmaking.STARTED_GAMES[i].players[1]);
        }
    }
  }
  if(player.y > 1500){
    //respawn for diffrent players
    if(y == 0){
      matchmaking.STARTED_GAMES[i].players[0].y = 100;
      matchmaking.STARTED_GAMES[i].players[0].x = 100;
      matchmaking.STARTED_GAMES[i].players[0].dir = 0;
    }else{
      matchmaking.STARTED_GAMES[i].players[1].y = 100;
      matchmaking.STARTED_GAMES[i].players[1].x = 1180;
      matchmaking.STARTED_GAMES[i].players[1].dir = 0;
    }
    //if player died we sync client and server.
    gameclock.sync(matchmaking.STARTED_GAMES[i].players[0], matchmaking.STARTED_GAMES[i].players[1]);
  }
}
}
};

function check_feet_collision(player){
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, player.socket.id);
  var thisplayer = matchmaking.STARTED_GAMES[games_check.index].players[games_check.Player];
  var otherplayer = matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer];
  //Checks if players touch other player, if he does and is above other player he is sent ontop of other player
    if(player_collision(thisplayer) != "nothing" && thisplayer.y <= otherplayer.y){
      if(thisplayer.y <= otherplayer.y){
        return {y:otherplayer.y - otherplayer.state.hitbox_H, sync:true};
      }
      return {y:otherplayer.y - otherplayer.state.hitbox_H, sync:false};
    }
    //if no other player is tocued we check if he touch any platform, if he does he is sent to stand on platform
  for(var i = 0; i < info.platforms.length; i++){
    if(player.x + (player.state.hitbox_W/2)  >= info.platforms[i].xstart && player.x - (player.state.hitbox_W/2) <= info.platforms[i].xend){
      if(player.y + player.y_speed>= info.platforms[i].y && player.y + player.y_speed <= info.platforms[i].y +  info.platforms[i].thickness){
        return {y:info.platforms[i].y, sync:false};
      }
    }
  }
  //No collision and we return false
  return false;
}

function check_head_collision(player){
  //simply checks if player is about to touch platform with his head
  for(var i = 0; i < info.platforms.length; i++){
    if(info.platforms[i].thickness > 30){
      if(player.x + (player.state.hitbox_W/2) >= info.platforms[i].xstart && player.x - (player.state.hitbox_W/2) <= info.platforms[i].xend){
        if(player.y - player.state.hitbox_H + player.y_speed <= info.platforms[i].y + info.platforms[i].thickness && player.y - player.state.hitbox_H + player.y_speed >= info.platforms[i].y){
          //These are cords for the player where his y should be after touching a platform with head, since his y cord is at his feet.
          return info.platforms[i].y+info.platforms[i].thickness+player.state.hitbox_H;
        }
      }
    }
  }
  return false;
}

function check_x_move(player){
  //If we collide with other player and are moving we send back a stop message.
  if(player_collision(player, 10) != "nothing" && player.x_speed != 0){
    return "stop";
  }
  //If we collide with wall we send back either "stop" or "bounce" dpending on what wall it is.
  for(var i = 0; i < info.walls.length; i++ ){
    if(player.x + (player.state.hitbox_W/2) + player.x_speed  >= info.walls[i].x && player.x - (player.state.hitbox_W/2) + player.x_speed  <= info.walls[i].x +info.walls[i].thickness ){
      if(player.y - player.state.hitbox_H <  info.walls[i].yend && player.y > info.walls[i].ystart){
        if(info.walls[i].bouncy){
          return "bounce";
        }else{
          return "stop";
        }
      }
    }
    }
    //nothing is found we return "nothing"
  return "nothing";
}

function player_collision(player, extra){
  //Extra is in order for player to run ontop of eachoter or touch eacother we need a little diffrence between check in x and y.
  if(!extra){
    extra = 0;
  }
  var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, player.socket.id);
  var other_player = matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer];

  //checks if there is a match and if there is we check if the players in the match have same cordinates.
  if(matchmaking.STARTED_GAMES[games_check.index]){
    if(player.x + (player.state.hitbox_W/2) + extra + player.x_speed >= other_player.x - (other_player.state.hitbox_W)/2 - extra + other_player.x_speed){
      if(player.x - (player.state.hitbox_W/2) - extra + player.x_speed <= other_player.x + (other_player.state.hitbox_W)/2 + extra + other_player.x_speed){
        if(player.y - player.state.hitbox_H + player.y_speed <=  other_player.y + other_player.y_speed - extra){
          if(player.y + player.y_speed >=  other_player.y - other_player.state.hitbox_H + other_player.y_speed + extra){
              return {playery_feet: other_player.y, playery_head: other_player.y - other_player.state.hitbox_H};
          }
        }
      }
    }
  }
  return "nothing";
}

exports.expolsion = function(x,y,force,players){
  for(var i = 0; i < players.length; i++){
    var playerY = players[i].y+(players[i].state.hitbox_H/2)
    var angle = Math.atan2(y-playerY, x - players[i].x);
    var dist = (Math.sqrt(Math.pow(y-playerY,2) + Math.pow(x - players[i].x,2)) / 40);
    force = force/dist;
    angle = angle;
    players[i].y_speed += (-1) * Math.sin(angle)*force;
    players[i].x_speed += (-1) * Math.cos(angle)*force;
    var games_check = matchmaking.findplayer(matchmaking.STARTED_GAMES, players[i].socket.id);
    var other_player = matchmaking.STARTED_GAMES[games_check.index].players[games_check.NotPlayer];
    gameclock.sync(players[i], other_player);
  }
}

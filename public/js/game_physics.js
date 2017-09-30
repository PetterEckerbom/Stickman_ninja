/*
This file is very simular to physics.js in the server as they are meant to server the same pourpose.
This is a little skinned down but any unclearities should be explained in there. There ont be as many comments
in this one.
*/
//this function is the same thing as the one in physics.js
function move_players(){
  for(var i = 0; i < 2; i++){
    var do_what = check_x_move(players[i]);
    if(do_what == "stop"){

      if(players[i].x_speed < 0){
        players[i].x += 10;
      }else{
        players[i].x -= 10;
      }
      players[i].x_speed = 0;
    }else if(do_what == "bounce"){
      players[i].x_speed = players[i].x_speed*-1*7;
      if(players[i].x_speed > 12){
        players[i].x_speed = 12;
      }else if(players[i].x_speed < -12){
        players[i].x_speed = -12;
      }
      players[i].y_speed = -12;
      players[i].dir = 0;
    }
        if(players[i].dir != 0){
          if(players[i].x_speed < players[i].max_speed && players[i].x_speed > players[i].max_speed*-1){
            players[i].x_speed += players[i].dir * players[i].accerelation;
          }
        }
        if(players[i].x_speed > 0){
          if(players[i].y_speed == 0 ){
            players[i].x_speed -= players[i].friction;
          }
          players[i].x_speed -= (players[i].friction*1.5);
        }
        if(players[i].x_speed < 0){
          if(players[i].y_speed == 0 ){
            players[i].x_speed += players[i].friction;
          }
          players[i].x_speed += (players[i].friction*1.5);
        }
        if(players[i].x_speed < 1 && players[i].x_speed> -1){
          players[i].x_speed = 0;
          players[i].x_speed = 3*players[i].dir;
        }
        players[i].x += players[i].x_speed;

      }
}

//this function is also the same.
function move_down(){
  var y_check;
    for(var i = 0; i < 2; i++){
      if(players[i].y_speed < 0){
         y_check = check_head_collision(players[i]);
        if(y_check === false){
          players[i].y+=players[i].y_speed;
          players[i].y_speed += players[i].gravity;
        }else{
          players[i].y=y_check;
           players[i].y_speed = 1;
        }
      }else{
     y_check = check_feet_collision(players[i]);
    if(y_check === false){
       players[i].y+=players[i].y_speed;
      if(players[i].y_speed < 17){
        players[i].y_speed += players[i].gravity;
      }
    }else{
       players[i].y=y_check;
        players[i].y_speed = 0;
        players[i].flipping = false;
    }
  }
}
}

//this function workes the same way as the one in physics.js in the server
function check_feet_collision(player){
  //it first check what player it is as there can only be 2
  if(player == players[0]){
    if(player_collision(players[0] ,players[1]) == false && players[0].y <= players[1].y){
      return players[1].y - players[1].animation.hitbox_H;
    }
  }else{
    if(player_collision(players[1] ,players[0]) == false && players[1].y <= players[0].y){
      return players[0].y - players[0].animation.hitbox_H;
    }
  }
  for(var i = 0; i < platform.length; i++){
    if(player.x + (player.animation.hitbox_W/2) >= platform[i].xstart && player.x - (player.animation.hitbox_W/2) <= platform[i].xend){
      if(player.y + player.y_speed >= platform[i].y && player.y + player.y_speed <= platform[i].y +  platform[i].thickness){
        return platform[i].y;
      }
    }
  }
  return false;
}

//same thing here!
function check_head_collision(player){
  for(var i = 0; i < platform.length; i++){
    if(platform[i].thickness > 30){
      if(player.x + (player.animation.hitbox_W/2) >= platform[i].xstart && player.x - (player.animation.hitbox_W/2) <= platform[i].xend){
        if(player.y - player.animation.hitbox_H + player.y_speed<= platform[i].y + platform[i].thickness && player.y - player.animation.hitbox_H + player.y_speed >= platform[i].y){
          return platform[i].y+platform[i].thickness+player.animation.hitbox_H;
        }
      }
    }
  }
  return false;
}

//very simular to physics.js but ofcourse it also send the player who is not playing to player_collision.
function check_x_move(player){
  if(player == players[0]){
    not = players[1];
  }else{
    not = players[0];
  }
  if(player_collision(player, not, 10) === false && player.x_speed != 0){
    return "stop";
  }
  for(var i = 0; i < walls.length; i++ ){
    if(player.x + (player.animation.hitbox_W/2) + player.x_speed >= walls[i].x && player.x - (player.animation.hitbox_W/2) + player.x_speed <= walls[i].x +walls[i].thickness ){
      if(player.y - player.animation.hitbox_W <  walls[i].yend && player.y > walls[i].ystart){
        if(walls[i].bouncy){
          return "bounce";
        }else{
          return "stop";
        }
      }
    }
    }
  return "normal";
}

//same as in pysics.js but it takes in both players instead of searching for them.
//there are only 2 players on the client  and that is why this is a simpler solution here.
function player_collision(player ,not, extra){
  if(!extra){
    extra = 0;
  }
  if(player.x + (player.animation.hitbox_W/2) + extra + player.x_speed >= not.x - (not.animation.hitbox_W)/2 - extra + not.x_speed){
    if(player.x - (player.animation.hitbox_W/2) - extra + player.x_speed <= not.x + (not.animation.hitbox_W)/2 + extra + not.x_speed){
      if(player.y + player.y_speed - player.animation.hitbox_H <=  not.y + not.y_speed - extra){
        if(player.y + player.y_speed >=  not.y - not.animation.hitbox_H + not.y_speed + extra){
            return false;
        }
      }
    }
  }
  return true;
}

//this function runs a loop for as many time as the server has probably done it with the packet sent//this is used to get a more accurate sync on devices with high latency aka above 33ms
function latency_comp(ping){
  while(ping > 100/3){
    move_players();
    move_down();
    ping -= (100/3);
  }
}

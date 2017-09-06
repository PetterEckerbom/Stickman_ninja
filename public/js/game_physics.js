function move_players(){
  for(var i = 0; i < 2; i++){
    var do_what = check_x_move(players[i]);
    if(do_what == "stop"){
      if(players[i].x_speed < 0){
        players[i].x += 5;
      }else{
        players[i].x -= 5;
      }
      players[i].x_speed = 0;
    }else if(do_what == "bounce"){
      players[i].x_speed = players[i].x_speed*-1*10;
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
          players[i].x_speed -= players[i].friction;
        }
        if(players[i].x_speed < 0){
          players[i].x_speed += players[i].friction;
        }
        if(players[i].dir == 0 && players[i].x_speed < 0.3 && players[i].x_speed> -0.3){
          players[i].x_speed = 0;
        }
        players[i].x += players[i].x_speed;

      }
}

function move_down(){
    for(var i = 0; i < 2; i++){
      if(players[i].y_speed < 0){
        var y_check = check_head_collision(players[i]);
        if(!y_check){
          players[i].y+=players[i].y_speed;
          players[i].y_speed += players[i].gravity;
        }else{
          players[i].y=y_check;
           players[i].y_speed = 1;
        }
      }else{
    var y_check = check_feet_collision(players[i]);
    if(!y_check){
       players[i].y+=players[i].y_speed;
      if(players[i].y_speed < 17){
        players[i].y_speed += players[i].gravity;
      }
    }else{
       players[i].y=y_check;
        players[i].y_speed = 0;
    }
  }
    find_animation(players[i]);
}
}

function check_feet_collision(player){
  for(var i = 0; i < platform.length; i++){
    if(player.x + (player.animation.hitbox_W/2) >= platform[i].xstart && player.x - (player.animation.hitbox_W/2) <= platform[i].xend){
      if(player.y >= platform[i].y && player.y <= platform[i].y +  platform[i].thickness){
        return platform[i].y;
      }
    }
  }
  return false;
}

function check_head_collision(player){
  for(var i = 0; i < platform.length; i++){
    if(platform[i].thickness > 30){
      if(player.x + (player.animation.hitbox_W/2) >= platform[i].xstart && player.x - (player.animation.hitbox_W/2) <= platform[i].xend){
        if(player.y - player.animation.hitbox_H <= platform[i].y + platform[i].thickness && player.y - player.animation.hitbox_H >= platform[i].y){
          return platform[i].y+platform[i].thickness+player.animation.hitbox_H;
        }
      }
    }
  }
  return false;
}

function check_x_move(player){
  //console.log(player.animation.hitbox_W)
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

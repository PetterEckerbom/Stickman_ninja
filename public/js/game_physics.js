function move_players(){
  for(var i = 0; i < 2; i++){
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
    var y_check = check_collision(players[i].x, players[i].y+players[i].y_speed)
    if(!y_check){
       players[i].y+=players[i].y_speed;
       players[i].y_speed += players[i].gravity;
      find_animation(players[i])
    }else{
       players[i].y=y_check
        players[i].y_speed = 0;
        find_animation(players[i])
    }
  }
}

function check_collision(x, y){
  for(var i = 0; i < platform.length; i++){
    if(x >= platform[i].xstart && x <= platform[i].xend){
      if(y >= platform[i].y && y <= platform[i].y +  platform[i].thickness){
        return platform[i].y;
      }
    }
  }
  return false;
}

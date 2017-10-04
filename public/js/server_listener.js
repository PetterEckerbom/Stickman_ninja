//When serve tells us that a player change direction we set the dir to whatever server says and if it is 1 or -1 we change what he is facing
socket.on('Change_direction_you', function(dir){
  players[0].dir = dir;
  if(dir == 1){
    players[0].facing = "right";
  }
  if(dir == -1){
    players[0].facing = "left";
  }
  //we also call find_animation in case it has changed (almost always change when dir change)
  find_animation(players[0]);
});
//same as above
socket.on('Change_direction_enemy', function(dir){
  players[1].dir = dir;
  if(dir == 1){
    players[1].facing = "right";
  }
  if(dir == -1){
    players[1].facing = "left";
  }
  find_animation(players[1]);
});

socket.on("punch",function(data){
  //if he is standing on ground he gets stopped by punching.
  if(players[data.player].y_speed == 0){
    players[data.player].x_speed = 0;
  }
  //he gets speed in the direction he is facing, depending on hit he get littel to a lot of speed
  if(players[data.player].facing =="left"){
    players[data.player].x_speed = (2 * data.type + 2) * -1;
  }else{
    players[data.player].x_speed = 2 * data.type + 2;
  }
  //his dir get set to 0, animation set to appriprate punch and frame reset.
  players[data.player].dir = 0;
  players[data.player].animationlock = true;
  players[data.player].frame = 0;
  if(data.player == 0){
    animation_change_you(animations['punch'+data.type]);
  }else if(data.player == 1){
    animation_change_enemy(animations['punch'+data.type]);
  }
  //when he regains control we call move_change again in order for player to not have to re_trogger it!
  setTimeout(move_change, 6000/7);
});

//this is to apply a the flipping animation when the other jump comes through.
socket.on('flipping', function(player){
  players[player].flipping = true;
});

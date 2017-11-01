//Initiate global varibles to store the animation flipping . so we can pause it.
var enemy_animation;
var you_animation;

//start those animations at 10fps
function startanimation(){
  enemy_animation = setInterval(flipframes_enemy, 1000/10);
  you_animation = setInterval(flipframes_you, 1000/10);
}
function flipframes_enemy(){
  //flip frames for enemt
  players[1].frame++;
  //if we have  alocked anymation we check if we excceeded maxframes and in thatcase we unlock.
  if(players[1].animationlock && players[1].frame >= players[1].animation.maxframe){
    players[1].animationlock = false;
  }
}
//same as above!
function flipframes_you(){
  players[0].frame++;
  if(players[0].animationlock && players[0].frame >= players[0].animation.maxframe){
    players[0].animationlock = false;
  }
}
function draw_map(){
  ctx.clearRect(0, 0, c.width, c.height);
  //Temp way of drawing map elements
  ctx.fillStyle="#ff0026";
  for(var i=0;i<platform.length;i++){
  ctx.fillRect(platform[i].xstart+xoffset,platform[i].y+yoffset,(platform[i].xend - platform[i].xstart),platform[i].thickness);
  }
  ctx.fillStyle="#00f735";
  for(var y=0;y<walls.length;y++){
  ctx.fillRect(walls[y].x+xoffset,walls[y].ystart+yoffset,walls[y].thickness,walls[y].yend - walls[y].ystart);
  }
  ctx.fillStyle="#0c00ff";
  for(var x=0;x<jumppad.length;x++){
  ctx.fillRect(jumppad[x].x+xoffset,jumppad[x].y+yoffset,jumppad[x].width,20);
  }
}
function draw_players(){
  //sets fillstyle to blue to draw client name.
  ctx.fillStyle="#0000ff";
  ctx.font="20px Arial";
      for(var i = 0; i < 2; i++){
        //checks if it the red or blue sprite that should be drawn
      var color ="RED_";
      if(i == 0){
        color = "BLUE_";
      }
      //grab the sprite from HTML with direction, color and animation that is approprate.
     var sprite = document.getElementById(color+players[i].animation.sprite+"_"+players[i].facing);
     //This effectyvly is the varible for what part of the spritesheet should be drawn.
     var xcrop = (players[i].frame%players[i].animation.frames)*players[i].animation.width;
     var player_width = players[i].animation.width;
     var player_height = players[i].animation.height;
     //draws the playername right above where the hitbox ends in y axis and centered on the x
     ctx.textAlign="center";
     ctx.fillText(players[i].name,players[i].x+xoffset,players[i].y-players[i].animation.hitbox_H+yoffset-5);
     //drawn the player, uses all previos varibles but devides the hight and width by 3 as all sprites are made 3 time bigger then they should.
     ctx.drawImage(sprite,xcrop,0,player_width,player_height,players[i].x-((player_width/3)/2)+xoffset,players[i].y-(player_height/3)+yoffset,player_width/3,player_height/3);
     //sets fillstyle to red for nexttime it should write the enemy name.
      ctx.fillStyle="#ff0000";
   }
}

function draw_boxes(){
  for(var i = 0; i < boxes.length; i++){
    if(boxes[i].type == "yours"){
      ctx.fillStyle="#6842f4";
    }else if(boxes[i].type == "enemys"){
      ctx.fillStyle="#f74254";
    }else{
      ctx.fillStyle="#913c00";
    }
    ctx.fillRect(boxes[i].cords.x+xoffset-25,boxes[i].cords.y+yoffset-50,50,50);
  }
}

function draw_shurikens(){
  for(var i = 0; i < shurikens.length; i++){
    if(shurikens[i].owner == "your"){
      ctx.fillStyle="#6842f4";
    }else if(shurikens[i].owner == "enemy"){
      ctx.fillStyle="#f74254";
    }
    ctx.fillRect(shurikens[i].x+xoffset-10,shurikens[i].y+yoffset-10,20,20);
  }
}
function draw_bombs(){
  for(var i = 0; i < bombs.length; i++){
    ctx.fillStyle="#000000";
    ctx.fillRect(bombs[i].x+xoffset-15,bombs[i].y+yoffset-15,30,30);
  }
}

//these functions take in an animation, sets the framerate to the correct speed and resets all frames in order to apply the correct animation.
function animation_change_you(animation){
  if(players[0].animation != animation && !players[0].animation_block ){
    clearInterval(you_animation);
    players[0].animation = animation;
    players[0].frames = 1;
    you_animation = setInterval(flipframes_you, animation.fps);
  }
}
function animation_change_enemy(animation){
  if(players[1].animation != animation && !players[1].animation_block ){
    clearInterval(enemy_animation);
    players[1].frames = 1;
    players[1].animation = animation;
    enemy_animation = setInterval(flipframes_enemy, animation.fps);
  }

}

//this animation looks at speed in diffrent axis and things like that in order to determin what animation should be playing
function find_animation(player){
  //if there is an animationlock it doesnt do anything. Animation lock is used for animations that cant be cancelled such as puch
  if(!player.animationlock){
    var animation_found;
    if(player.flipping){
      animation_found = animations.flip;
    }else if(player.y_speed > 0){
      animation_found = animations.falling;
    }else if(player.y_speed < 0){
      animation_found = animations.jump;
    }else if(player.dir == 0){
      animation_found = animations.idle;
    }else if(player.dir != 0){
      animation_found = animations.running;
    }

    //it calls the animationchange functions once it found the correct animation.
    if(players[0] == player){
      animation_change_you(animation_found);
    }else{
      animation_change_enemy(animation_found);
    }
  }
}

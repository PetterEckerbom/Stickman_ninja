var enemy_animation;
var you_animation;

function startanimation(){
  enemy_animation = setInterval(flipframes_enemy, 1000/10);
  you_animation = setInterval(flipframes_you, 1000/10);
}
function flipframes_enemy(){
  players[1].frame++;
}
function flipframes_you(){
  players[0].frame++;
}
function draw_players(){
  ctx.fillStyle="#0000ff";
  ctx.font="20px Arial";
      for(var i = 0; i < 2; i++){
      var color ="RED_";
      if(i == 0){
        color = "BLUE_";
      }
     var sprite = document.getElementById(color+players[i].animation.sprite+"_"+players[i].facing);
     var xcrop = (players[i].frame%players[i].animation.frames)*players[i].animation.width;
     var player_width = players[i].animation.width;
     var player_height = players[i].animation.height;
     ctx.textAlign="center";
     ctx.fillText(players[i].name,players[i].x+xoffset,players[i].y-players[i].animation.hitbox_H+yoffset-5);
     ctx.drawImage(sprite,xcrop,0,player_width,player_height,players[i].x-((player_width/3)/2)+xoffset,players[i].y-(player_height/3)+yoffset,player_width/3,player_height/3);
      ctx.fillStyle="#ff0000";
   }
}

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

function find_animation(player){
  var animation_found;
  if(player.y_speed != 0){
    animation_found = animations.falling;
  }else if(player.dir == 0){
    animation_found = animations.idle;
  }else if(player.dir != 0){
    animation_found = animations.running;
  }


  if(players[0] == player){
    animation_change_you(animation_found);
  }else{
    animation_change_enemy(animation_found);
  }
}

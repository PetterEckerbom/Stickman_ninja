var enemy_animation;
var you_animation;

function startanimation(){
  enemy_animation = setInterval(flipframes_enemy, 1000/10);
  enemy_animation = setInterval(flipframes_you, 1000/10);
}
function flipframes_enemy(){
  enemy.frame++;
}
function flipframes_you(){
  you.frame++;
}
function draw_enemy(){
   var sprite = document.getElementById("RED_"+enemy.animation.sprite+"_"+enemy.facing);
   var xcrop = (enemy.frame%enemy.animation.frames)*enemy.animation.width;
   var player_width = enemy.animation.width;
   var player_height = enemy.animation.height;
  ctx.drawImage(sprite,xcrop,0,player_width,player_height,enemy.x,enemy.y,player_width/3,player_height/3);
}
function draw_you(){
   var sprite = document.getElementById("BLUE_"+you.animation.sprite+"_"+you.facing);
   var xcrop = (you.frame%you.animation.frames)*you.animation.width;
   var player_width = you.animation.width;
   var player_height = you.animation.height;
  ctx.drawImage(sprite,xcrop,0,player_width,player_height,you.x,you.y,player_width/3,player_height/3);
}

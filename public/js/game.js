//Just draws all platforms
window.onload = function() {
    var c=document.getElementById("main");
    var ctx=c.getContext("2d");
	ctx.fillStyle="#ff0026";
    for(var i=0;i<platform.length;i++){
		ctx.fillRect(platform[i].xstart,platform[i].y,platform[i].xend - platform[i].xstart,platform[i].thickness);
	}
  startanimation()
};
//to make sure canvas doesnt get to big
var players = [
  you = {
    name,
    x:0,
    y:0,
    frame:1,
    x_speed:0,
    y_speed:0,
    state:"idle",
    enemy:false,
    facing:"right"
  },
  enemy = {
    name,
    x:1230,
    y:0,
    frame:1,
    x_speed:0,
    y_speed:0,
    state:"idle",
    facing:"left"
  }
]
var enemy_animation;
var you_animation;
var RED_left = document.getElementById('RED_left');
var BLUE_right = document.getElementById('BLUE_right');
function startanimation(){
  enemy_animation = setInterval(flipframes_enemy, 1000/10);
  enemy_animation = setInterval(flipframes_you, 1000/10);
}
function flipframes_enemy(){
  players[1].frame++;
}
function flipframes_you(){
  players[0].frame++;
}

setInterval(function () {
  var c=document.getElementById("main");
  var ctx=c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle="#ff0026";
  for(var i=0;i<platform.length;i++){
  ctx.fillRect(platform[i].xstart,platform[i].y,platform[i].xend - platform[i].xstart,platform[i].thickness);
  }
//"RED_"+enemy.state+"_"+enemy.facing
//  ctx.drawImage(RED_right,  (players[1].frame%8)*300,0,0,0,  players[1].x,  players[1].y,50,100);
  ctx.drawImage(RED_left,(players[1].frame%8)*150,0,150,300,players[1].x,players[1].y,50,100);
  ctx.drawImage(BLUE_right,(players[0].frame%8)*150,0,150,300,players[0].x,players[0].y,50,100);
//  ctx.drawImage("BLUE_"+you.state+"_"+you.facing,enemy.frame*150,0,enemy.x,enemy.y,50,100);
},1000/30);

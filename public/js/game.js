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
var players = [
  you = {
    name,
    x:100,
    y:100,
    frame:1,
    x_speed:0,
    y_speed:0,
    dir:0,
    friction: 0.2,
    accerelation:0.3,
    gravity: 0.4,
    max_speed:7,
    state:"idle",
    enemy:false,
    facing:"right",
    animation: animations.idle
  },
enemy = {
    name,
    x:1180,
    y:100,
    frame:1,
    x_speed:0,
    y_speed:0,
    dir:0,
    friction: 0.2,
    accerelation:0.3,
    gravity: 0.4,
    max_speed:7,
    moving:0,
    state:"idle",
    facing:"left",
    animation: animations.idle
  }
];
//to make sure canvas doesnt get to big
var c=document.getElementById("main");
var ctx=c.getContext("2d");

onkeydown = function(e){
  if(e.keyCode == 68){
    socket.emit('move', 1)
  }
  if(e.keyCode == 65){
    socket.emit('move', -1)
  }
}
onkeyup = function(e){
  if(e.keyCode == 68 && players[0].dir == 1){
    socket.emit('move', 0)
  }
  if(e.keyCode == 65 && players[0].dir == -1){
    socket.emit('move', 0)
  }
  if(e.keyCode == 32){
    socket.emit('jump', 0)
  }
}

socket.on('Change_direction_you', function(dir){
  players[0].dir = dir;
  if(dir == 1){
    players[0].facing = "right";
    players[0].x_speed = 2;
    animation_change_you(animations.running);
  }
  if(dir == -1){
    players[0].facing = "left";
    players[0].x_speed = -2;
    animation_change_you(animations.running);
  }
  if(dir == 0){
    animation_change_you(animations.idle);
  }
});
socket.on('Change_direction_enemy', function(dir){
  players[1].dir = dir;
  if(dir == 1){
    players[1].facing = "right";
    players[1].x_speed = 2;
    animation_change_enemy(animations.running);
  }
  if(dir == -1){
    players[1].facing = "left";
    players[1].x_speed = -2;
    animation_change_enemy(animations.running);
  }
  if(dir == 0){
    animation_change_enemy(animations.idle);
  }
});
socket.on('sync', function(players_skinned){
  console.log(players_skinned.you.y)
  players[0].x = players_skinned.you.x;
  players[0].y = players_skinned.you.y;
  players[0].x_speed = players_skinned.you.x_speed;
  players[0].y_speed = players_skinned.you.y_speed;
  players[0].facing = players_skinned.you.facing;
  players[0].dir = players_skinned.you.dir;

  players[1].x = players_skinned.enemy.x;
  players[1].y = players_skinned.enemy.y;
  players[1].x_speed = players_skinned.enemy.x_speed;
  players[1].y_speed = players_skinned.enemy.y_speed;
  players[1].facing = players_skinned.enemy.facing;
  players[1].dir = players_skinned.enemy.dir;

});
socket.on('you_jump',function(){
  players[0].y_speed = -8;
});
socket.on('enemy_jump',function(){
  players[1].y_speed = -8;
});


setInterval(function () {
  //Graphics
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle="#ff0026";
  for(var i=0;i<platform.length;i++){
  ctx.fillRect(platform[i].xstart,platform[i].y,platform[i].xend - platform[i].xstart,platform[i].thickness);
  }
  move_down();
  move_players();
  draw_players();
  //Movement

},1000/30);

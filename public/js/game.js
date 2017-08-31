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
    x:100,
    y:100,
    frame:1,
    x_speed:0,
    y_speed:0,
    dir:0,
    friction: 0.2,
    accerelation:0.3,
    gravity: 0.4,
    moving:0,
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
var c=document.getElementById("main");
var ctx=c.getContext("2d");

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

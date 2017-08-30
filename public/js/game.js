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
var  you = {
    name,
    x:0,
    y:0,
    frame:1,
    x_speed:0,
    y_speed:0,
    friction: 0.15,
    accerelation:0.15,
    moving:0,
    max_speed:4,
    state:"idle",
    enemy:false,
    facing:"right",
    animation: animations.idle
  };
var  enemy = {
    name,
    x:1230,
    y:0,
    frame:1,
    x_speed:0,
    y_speed:0,
    friction: 0.15,
    accerelation:0.15,
    max_speed:4,
    moving:0,
    state:"idle",
    facing:"left",
    animation: animations.idle
  };
var c=document.getElementById("main");
var ctx=c.getContext("2d");

setInterval(function () {
  //Graphics
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle="#ff0026";
  for(var i=0;i<platform.length;i++){
  ctx.fillRect(platform[i].xstart,platform[i].y,platform[i].xend - platform[i].xstart,platform[i].thickness);
  }
  draw_enemy();
  draw_you();

  //Movement

},1000/30);

window.onload = function() {
    var c=document.getElementById("main");
    var ctx=c.getContext("2d");
	ctx.fillStyle="#ff0026";
    for(var i=0;i<world.length;i++){
		ctx.fillRect(world[i].xstart,world[i].y,world[i].xend - world[i].xstart,world[i].thickness);
	}
};
document.getElementById("main").style.maxHeight = window.innerHeight + "px";
   onresize = function(){
     document.getElementById("main").style.maxWidth = window.innerWidth-50 + "px";
     document.getElementById("main").style.maxHeight = window.innerHeight-50 + "px";
   }

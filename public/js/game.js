//Just draws all platforms
window.onload = function() {
    var c=document.getElementById("main");
    var ctx=c.getContext("2d");
	ctx.fillStyle="#ff0026";
    for(var i=0;i<platform.length;i++){
		ctx.fillRect(platform[i].xstart,platform[i].y,platform[i].xend - platform[i].xstart,platform[i].thickness);
	}
};
//to make sure canvas doesnt get to big
document.getElementById("main").style.maxHeight = window.innerHeight + "px";
   onresize = function(){
     document.getElementById("main").style.maxWidth = window.innerWidth-50 + "px";
     document.getElementById("main").style.maxHeight = window.innerHeight-50 + "px";
   }

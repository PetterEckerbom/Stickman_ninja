setInterval(function () {
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
  //calls functions that should be updated every tick and fuctions that may change outcome of the other function calls
  move_change();
  move_players();
  move_down();
  draw_players();
  find_animation(players[0]);
  find_animation(players[1]);
  //Movement

},1000/30);

//take in a ping, display last ping result and ping back to server with the latest ping. this is so server can calculate latency
socket.on('ping',function(data){
  if(data){
    document.getElementById('ping').innerHTML = "Ping:"+Math.round(data.ping)+"ms";
    socket.emit('back_ping', data.id);
  }
});

//takes all values the server provides and applies them to client players.
//Hopefully they should already match pretty well ub order to avoid rubberbanding
socket.on('sync', function(players_skinned){
  players[0].x_speed = players_skinned.you.x_speed;
  players[0].y_speed = players_skinned.you.y_speed;
  players[0].x = players_skinned.you.x;
  players[0].y = players_skinned.you.y;
  players[0].facing = players_skinned.you.facing;
  players[0].dir = players_skinned.you.dir;

  players[1].x_speed = players_skinned.enemy.x_speed;
  players[1].y_speed = players_skinned.enemy.y_speed;
  players[1].x = players_skinned.enemy.x;
  players[1].y = players_skinned.enemy.y;
  players[1].facing = players_skinned.enemy.facing;
  players[1].dir = players_skinned.enemy.dir;
  //calls the latency compencation function with the latency so it can predict what the server did with the time it took for packet to travel.
  latency_comp(players_skinned.ping);
});

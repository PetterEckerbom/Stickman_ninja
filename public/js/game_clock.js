setInterval(function () {
  ctx.clearRect(0, 0, c.width, c.height);
  draw_map();
  //calls functions that should be updated every tick and fuctions that may change outcome of the other function calls
  move_change();
  move_players();
  move_down();
  draw_players();
  draw_boxes();
  find_animation(players[0]);
  find_animation(players[1]);
  move_shuriken();
  draw_shurikens();
  move_bomb();
  draw_bombs();
  move_iceballs();
  draw_iceballs();
  //Movement

},1000/30);

function move_shuriken(){
  for(var i = 0; i < shurikens.length; i++){
    move_point(shurikens[i], 0.2, 0.45, true, true);
    //console.log(shurikens[i].x+ " Y: "+ shurikens[i].y);
  }
}
function move_bomb(){
  for(var i = 0; i < bombs.length; i++){
    move_point(bombs[i], 0.5, 0.45, true, true);
  }
}
function move_iceballs(){
  for(var i = 0; i < iceballs.length; i++){
    move_point(iceballs[i], 0, 0, false, false);
  }
}
var ping = 0;
//take in a ping, display last ping result and ping back to server with the latest ping. this is so server can calculate latency
socket.on('ping',function(data){
  if(data){
    ping = data.ping;
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

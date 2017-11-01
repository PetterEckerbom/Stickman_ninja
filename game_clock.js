var matchmaking = require('./matchmaking_server.js');
var physics = require('./physics.js');

setInterval(function(){
  //Runs the main functions every 33.333...ms
    matchmaking.setstate();
    physics.move_players();
    physics.move_down();
    move_shuriken();
    move_bomb();
    wingcheck();
},1000/30);

function wingcheck(){
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    for(var y = 0; y < matchmaking.STARTED_GAMES[i].players.length; y++){
      if(matchmaking.STARTED_GAMES[i].players[y].wings && matchmaking.STARTED_GAMES[i].players[y].y > -200){
        matchmaking.STARTED_GAMES[i].players[y].jumpready = true;
      }
    }
  }
}

function move_shuriken(){
  var deleteL = [];
    for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
      for(var y = 0; y < matchmaking.STARTED_GAMES[i].shurikens.length; y++){
        if(physics.move_point(matchmaking.STARTED_GAMES[i].shurikens[y], 0.2, 0.45, true, true)){
          deleteL.push({game: i, shuriken: y});
        }
        if(matchmaking.STARTED_GAMES[i].shurikens[y].y > 1000 || matchmaking.STARTED_GAMES[i].shurikens[y].x < -300 || matchmaking.STARTED_GAMES[i].shurikens[y].x > 1455){
          deleteL.push({game: i, shuriken: y});
        }
      }
    }
    for(var i = 0; i < deleteL.length; i++){
      matchmaking.STARTED_GAMES[deleteL[i].game].players[0].socket.emit('delete_shuriken', matchmaking.STARTED_GAMES[deleteL[i].game].shurikens[deleteL[i].shuriken].id);
      matchmaking.STARTED_GAMES[deleteL[i].game].players[1].socket.emit('delete_shuriken', matchmaking.STARTED_GAMES[deleteL[i].game].shurikens[deleteL[i].shuriken].id);
      matchmaking.STARTED_GAMES[deleteL[i].game].shurikens.splice(deleteL[i].shuriken, 1);
    }
}
function move_bomb(){
    for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
      for(var y = 0; y < matchmaking.STARTED_GAMES[i].bombs.length; y++){
        physics.move_point(matchmaking.STARTED_GAMES[i].bombs[y], 0.5, 0.40, true, true)
      }
    }
  }

setInterval(function(){
  //Every 7 seconds we sync up server and client, TO many sync makes for choppy player experience, to few syncs makes for inacurate calculations
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    sync(matchmaking.STARTED_GAMES[i].players[0], matchmaking.STARTED_GAMES[i].players[1]);
  }
},7000);
setInterval(function(){
  //Ping client every 50ms
    for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
      var d = new Date();
      var time = d.getTime();
      var id = Math.random();
      var id2 = Math.random();
      matchmaking.STARTED_GAMES[i].players[0].Ptime[id] = time;
      matchmaking.STARTED_GAMES[i].players[1].Ptime[id2] = time;
      matchmaking.STARTED_GAMES[i].players[0].socket.emit('ping', {id:id,ping:matchmaking.STARTED_GAMES[i].players[0].ping});
      matchmaking.STARTED_GAMES[i].players[1].socket.emit('ping', {id:id2,ping:matchmaking.STARTED_GAMES[i].players[1].ping});
    }
},50);

var sync = function (player1, player2){
  //This function skinnes donw the nessesary data of the player and sends it to the client. it also send the latency the server belives there is in the connection to the player
  var player1_skinned = {x: player1.x, y: player1.y,x_speed: player1.x_speed, y_speed: player1.y_speed,facing: player1.facing, dir: player1.dir};
  var player2_skinned = {x: player2.x, y: player2.y,x_speed: player2.x_speed, y_speed: player2.y_speed,facing: player2.facing, dir: player2.dir};
  player1.socket.emit('sync', {you:player1_skinned,enemy:player2_skinned,ping:player1.ping});
  player2.socket.emit('sync', {you:player2_skinned,enemy:player1_skinned,ping:player2.ping});
};
exports.sync = sync;

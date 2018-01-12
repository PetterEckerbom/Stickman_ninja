var matchmaking = require('./matchmaking_server.js');
var physics = require('./physics.js');
var items = require('./items.js');
var boxes = require('./boxes.js');

setInterval(function(){
  //Runs the main functions every 33.333...ms
    matchmaking.setstate();
    physics.move_players();
    physics.move_down();
    move_shuriken();
    move_bomb();
    move_iceball();
    move_banana();
    wingcheck();
    create_box();
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
function create_box(){
  for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
    if(Math.random() < (1/600) && matchmaking.STARTED_GAMES[i].boxes.length < 5){
      boxes.create_box(null, i);
    }
  }
}

function move_shuriken(){
  var deleteL = [];
    for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
      for(var y = 0; y < matchmaking.STARTED_GAMES[i].shurikens.length; y++){
        var player = matchmaking.STARTED_GAMES[i].players[0];
        var other = matchmaking.STARTED_GAMES[i].players[1];
        if(matchmaking.STARTED_GAMES[i].shurikens[y].owner === 0){
          player = matchmaking.STARTED_GAMES[i].players[1];
          other = matchmaking.STARTED_GAMES[i].players[0];
        }
        if(matchmaking.STARTED_GAMES[i].shurikens[y]){
          if(items.item_hit(matchmaking.STARTED_GAMES[i].shurikens[y], player)){
            matchmaking.decrese_health(player, 250);
            player.socket.emit("delete_shuriken", matchmaking.STARTED_GAMES[i].shurikens[y].id);
            other.socket.emit("delete_shuriken", matchmaking.STARTED_GAMES[i].shurikens[y].id);
            deleteL.push({game: i, shuriken: y});
          }
          if(matchmaking.STARTED_GAMES[i].shurikens[y]){
            if(physics.move_point(matchmaking.STARTED_GAMES[i].shurikens[y], 0.2, 0.45, true, true)){
              deleteL.push({game: i, shuriken: y});
            }
          }
          if(matchmaking.STARTED_GAMES[i].shurikens[y]){
            if(matchmaking.STARTED_GAMES[i].shurikens[y].y > 1000 || matchmaking.STARTED_GAMES[i].shurikens[y].x < -300 || matchmaking.STARTED_GAMES[i].shurikens[y].x > 1455){
              deleteL.push({game: i, shuriken: y});
            }
          }
        }
      }
    }
    for(var i = 0; i < deleteL.length; i++){
      if(matchmaking.STARTED_GAMES[deleteL[i].game].shurikens[deleteL[i].shuriken]){
        matchmaking.STARTED_GAMES[deleteL[i].game].players[0].socket.emit('delete_shuriken', matchmaking.STARTED_GAMES[deleteL[i].game].shurikens[deleteL[i].shuriken].id);
        matchmaking.STARTED_GAMES[deleteL[i].game].players[1].socket.emit('delete_shuriken', matchmaking.STARTED_GAMES[deleteL[i].game].shurikens[deleteL[i].shuriken].id);
        matchmaking.STARTED_GAMES[deleteL[i].game].shurikens.splice(deleteL[i].shuriken, 1);
      }
    }
}
function move_bomb(){
    for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
      for(var y = 0; y < matchmaking.STARTED_GAMES[i].bombs.length; y++){
        if(matchmaking.STARTED_GAMES[i].bombs.length){
          physics.move_point(matchmaking.STARTED_GAMES[i].bombs[y], 0.5, 0.40, true, true);
        }
      }
    }
  }
  function move_banana(){
      for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
        for(var y = 0; y < matchmaking.STARTED_GAMES[i].bananas.length; y++){
          physics.move_point(matchmaking.STARTED_GAMES[i].bananas[y], 0.2, 0.40, true, true);
          var target = get_players(matchmaking.STARTED_GAMES[i].players, matchmaking.STARTED_GAMES[i].bananas[y].owner);
          var banana = matchmaking.STARTED_GAMES[i].bananas[y];
          if(target.other.y_speed === 0 && items.item_hit(banana, target.other, matchmaking.STARTED_GAMES[i].bananas)){
            target.other.socket.emit("delete_banana", banana.id);
            target.player.socket.emit("delete_banana", banana.id);
            target.other.attackstack++;
            target.other.controlstack++;
            target.other.controlE = false;
            target.other.attackready = false;
            var dir = 1;
            if(target.other.facing == "left"){
              dir = -1;
            }
            target.other.x_speed = dir*13;
            target.other.dir = 0;
            target.other.fallen = true;
            target.other.socket.emit("fall", 0);
            target.player.socket.emit("fall", 1);
            setTimeout(up, 1440, i, target.other);
            setTimeout(attackready_back, 1500, target.other);
            setTimeout(controlE_back, 1500, target.other);
            sync(target.other, target.player);
            matchmaking.STARTED_GAMES[i].bananas.splice(matchmaking.STARTED_GAMES[i].bananas.indexOf(banana), 1);
          }
        }
      }
    }
    function up(game, player){
      if(matchmaking.STARTED_GAMES[game]){
        player.fallen = false;
      }
    }
    var controlE_back = function(player){
      player.controlstack--;
      if(player.controlstack <= 0){
        player.controlE = true;
        player.controlstack = 0;
      }
    };
    exports.controlE_back = controlE_back;
    function attackready_back(player){
      player.attackstack--;
      if(player.attackstack <= 0){
        player.attackready = true;
        player.attackstack = 0;
      }
    }
    function get_players(array, player){
      if(player === 0){
        return{player: array[0], other: array[1]};
      }else{
        return{player: array[1], other: array[0]};
      }
    }

  function move_iceball(){
    var deleteL = [];
      for(var i = 0; i < matchmaking.STARTED_GAMES.length; i++){
        for(var y = 0; y < matchmaking.STARTED_GAMES[i].iceballs.length; y++){
          if(matchmaking.STARTED_GAMES[i].iceballs[y]){}
            var player = matchmaking.STARTED_GAMES[i].players[0];
            var other = matchmaking.STARTED_GAMES[i].players[1];
            if(matchmaking.STARTED_GAMES[i].iceballs[y].owner === 0){
              player = matchmaking.STARTED_GAMES[i].players[1];
              other = matchmaking.STARTED_GAMES[i].players[0];
            }
            if(matchmaking.STARTED_GAMES[i].iceballs[y]){
              physics.move_point(matchmaking.STARTED_GAMES[i].iceballs[y], 0, 0, false, false);
            }
            if(matchmaking.STARTED_GAMES[i].iceballs[y].x < -300 || matchmaking.STARTED_GAMES[i].iceballs[y].x > 1455){
              if(matchmaking.STARTED_GAMES[i].iceballs[y]){
                deleteL.push({game: i, iceball: y});
              }
            }
            var iceball = matchmaking.STARTED_GAMES[i].iceballs[y];
            var array = matchmaking.STARTED_GAMES[i].iceballs;
            if(items.item_hit(iceball, player, array)){
              player.x_speed = 0;
              player.max_speed = 6;
              player.accerelation = 0.3;
              player.iceballhits++;
              matchmaking.decrese_health(player, 15);
              player.socket.emit("delete_iceball", iceball.id);
              other.socket.emit("delete_iceball", iceball.id);
              player.socket.emit("slowed", 0);
              other.socket.emit("slowed", 1);
              setTimeout(items.reset_speed, 8000, player);
              deleteL.push({game: i, iceball: y});
            }
          }
        }
      for(var x = 0; x < deleteL.length; x++){
        if(matchmaking.STARTED_GAMES[deleteL[x].game].iceballs[deleteL[x].iceball]){
          matchmaking.STARTED_GAMES[deleteL[x].game].players[0].socket.emit('delete_iceball', matchmaking.STARTED_GAMES[deleteL[x].game].iceballs[deleteL[x].iceball].id);
          matchmaking.STARTED_GAMES[deleteL[x].game].players[1].socket.emit('delete_iceball', matchmaking.STARTED_GAMES[deleteL[x].game].iceballs[deleteL[x].iceball].id);
          matchmaking.STARTED_GAMES[deleteL[x].game].iceballs.splice(deleteL[x].iceball, 1);
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

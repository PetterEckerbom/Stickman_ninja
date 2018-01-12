var matchmaking = require('./matchmaking_server.js');
var physics = require('./physics.js');
exports.shuriken = function(socket, force){
  force = force/12.5;
  var game_index = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(game_index != -1){
    var shuriken_array = matchmaking.STARTED_GAMES[game_index.index].shurikens;
    var player = matchmaking.STARTED_GAMES[game_index.index].players[game_index.Player];
    var notplayer = matchmaking.STARTED_GAMES[game_index.index].players[game_index.NotPlayer];
      if(player.attackready && player.controlE){
        var dir = 0;
        if(player.facing == "left"){
          dir = -1;
        }else{
          dir = 1;
        }
        var newshuriken = {x: player.x, y: (player.y-player.state.hitbox_H/2), x_speed: force*dir, y_speed: 0, owner: game_index.Player, id: Math.random()};
        player.socket.emit('new_shuriken', {type: "your", info: newshuriken});
        notplayer.socket.emit('new_shuriken', {type: "enemy", info: newshuriken});
        shuriken_array.push(newshuriken);
        player.charges--;
        if(player.charges <= 0){
          player.item = "nothing";
          player.charges = 0;
        }
    }
  }
};

exports.bomb = function(socket, force){
  var game_index = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  force = force/20;
  if(game_index != -1){
    var bombarray = matchmaking.STARTED_GAMES[game_index.index].bombs;
    var player = matchmaking.STARTED_GAMES[game_index.index].players[game_index.Player];
    var notplayer = matchmaking.STARTED_GAMES[game_index.index].players[game_index.NotPlayer];
    var dir = 0;
    if(player.facing == "left"){
      dir = -1;
    }else{
      dir = 1;
    }
      if(player.attackready && player.controlE){
        var newbomb = {x: player.x, y:(player.y-player.state.hitbox_H/2), x_speed: force*dir, y_speed: 0, owner: game_index.Player, id: Math.random()};
        player.socket.emit('new_bomb', {type: "your", info: newbomb});
        notplayer.socket.emit('new_bomb', {type: "enemy", info: newbomb});
        bombarray.push(newbomb);
        setTimeout(bomb_blowup, 1000, newbomb, bombarray, [player, notplayer]);
        player.charges--;
        if(player.charges <= 0){
          player.item = "nothing";
          player.charges = 0;
        }
    }
  }
};
function bomb_blowup(bomb, bombarray, players){
  if(bombarray){
    physics.expolsion(bomb.x,bomb.y,25,players);
    for(var i = 0; i < bombarray.length; i++){
      if(bombarray[i] == bomb){
        bombarray.splice(i, 1);
        return;
      }
    }
  }
}

exports.wings = function(socket){
  var game_index = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(game_index != -1){
    var bombarray = matchmaking.STARTED_GAMES[game_index.index].bombs;
    var player = matchmaking.STARTED_GAMES[game_index.index].players[game_index.Player];
    player.wings = true;
    setTimeout(losewing, 5000, player);
    player.charges = 0;
    player.item = "nothing";
  }
};
function losewing(player){
  if(player){
    player.wings = false;
  }
}

exports.iceball = function(socket){
  var game_index = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(game_index != -1){
    var iceball_array = matchmaking.STARTED_GAMES[game_index.index].iceballs;
    var player = matchmaking.STARTED_GAMES[game_index.index].players[game_index.Player];
    var notplayer = matchmaking.STARTED_GAMES[game_index.index].players[game_index.NotPlayer];
      if(player.attackready && player.controlE){
        var dir = 0;
        if(player.facing == "left"){
          dir = -1;
        }else{
          dir = 1;
        }
        var newiceball = {x: player.x, y: (player.y-player.state.hitbox_H/2), x_speed: 10*dir, y_speed: 0, owner: game_index.Player, id: Math.random()};
        player.socket.emit('new_iceball', {type: "your", info: newiceball});
        notplayer.socket.emit('new_iceball', {type: "enemy", info: newiceball});
        iceball_array.push(newiceball);
        player.charges--;
        if(player.charges <= 0){
          player.item = "nothing";
          player.charges = 0;
        }
    }
  }
};
exports.item_hit = function(item, player, array){
  if(item.x >= player.x - (player.state.hitbox_W/2) && item.x <= player.x + (player.state.hitbox_W/2)){
    if(item.y >= player.y - player.state.hitbox_H && item.y <= player.y){
      return true;
    }
  }
};
exports.reset_speed = function(player){
  player.iceballhits--;
  if(player.iceballhits <= 0){
    player.max_speed = 12;
    player.accerelation = 0.6;
    player.iceballhits = 0;
  }
};

exports.banana = function(socket){
  var game_index = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(game_index != -1){
    var banana_array = matchmaking.STARTED_GAMES[game_index.index].bananas;
    var player = matchmaking.STARTED_GAMES[game_index.index].players[game_index.Player];
    var notplayer = matchmaking.STARTED_GAMES[game_index.index].players[game_index.NotPlayer];
      if(player.attackready && player.controlE){
        var newbanana = {x: player.x, y: player.y-20, x_speed: 0, y_speed: 0, owner: game_index.Player, id: Math.random()};
        player.socket.emit('new_banana', {type: "your", info: newbanana});
        notplayer.socket.emit('new_banana', {type: "enemy", info: newbanana});
        banana_array.push(newbanana);
        player.charges--;
        if(player.charges <= 0){
          player.item = "nothing";
          player.charges = 0;
        }
    }
  }
};

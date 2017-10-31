var matchmaking = require('./matchmaking_server');
exports.shuriken = function(socket, force){
  var game_index = matchmaking.findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(game_index != -1){
    var shuriken_array = matchmaking.STARTED_GAMES[game_index.index].shurikens;
    var player = matchmaking.STARTED_GAMES[game_index.index].players[game_index.Player];
    var notplayer = matchmaking.STARTED_GAMES[game_index.index].players[game_index.NotPlayer];
    var dir = 0;
    if(player.facing == "left"){
      dir = -1
    }else{
      dir = 1
    }
    var newshuriken = {x: player.x, y: (player.y-player.state.hitbox_H/2), x_speed: force*dir, y_speed: 0, owner: game_index.index, id: Math.random()};
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

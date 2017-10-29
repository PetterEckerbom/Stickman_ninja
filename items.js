var matchmaking = require('./matchmaking_server');
exports.shuriken = function(socket, force){
  var game_index = findplayer(matchmaking.STARTED_GAMES, socket.id);
  if(game_index != -1){
    var shuriken_array = matchmaking.STARTED_GAMES[game_index.index].shurikens;
    var player = matchmaking.STARTED_GAMES[game_index.index].players[game_index.Player];
    var notplayer = matchmaking.STARTED_GAMES[game_index.index].players[game_index.NotPlayer];

    var newshuriken = {x: player.x, y: (player.y+player.state.hitbox_H/2), x_speed: force*player.dir, y_speed: 0, owner: game_index.index};
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

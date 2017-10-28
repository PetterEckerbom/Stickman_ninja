var info = require('./information.js');
var matchmaking = require('./matchmaking_server.js');

exports.create_box = function(player, game){
  var cords = getbox_cords();
  matchmaking.STARTED_GAMES[game].boxes.push({x:cords.x, y: cords.y, player: player});
  if(player === null){
    matchmaking.STARTED_GAMES[game].players[0].socket.emit('new_box',{cords: cords, type: "both"});
    matchmaking.STARTED_GAMES[game].players[1].socket.emit('new_box',{cords: cords, type: "both"});
  }else if(player === 0){
    matchmaking.STARTED_GAMES[game].players[0].socket.emit('new_box',{cords: cords, type: "yours"});
    matchmaking.STARTED_GAMES[game].players[1].socket.emit('new_box',{cords: cords, type: "enemys"});
  }else if(player === 1){
    matchmaking.STARTED_GAMES[game].players[0].socket.emit('new_box',{cords: cords, type: "enemys"});
    matchmaking.STARTED_GAMES[game].players[1].socket.emit('new_box',{cords: cords, type: "yours"});
  }
};

function getbox_cords(){
  var platform = info.platforms[Math.floor(Math.random()*info.platforms.length)];
  var y = platform.y;
  var x = Math.floor(Math.random() * (platform.xend-platform.xstart - 25) + platform.xstart+25);
  return {x:x, y:y};
}

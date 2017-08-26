let main = require('./app.js');

function player(id, elo, name, socket){
	this.x;
	this.y = 10;
	this.facing;
	this.action = "Idle";
	this.elo = elo;
	this.id = id;
	this.socket = socket;
	this.name = name;
}

function game_instance(player, type,id){
	this.type = type
	this.player1 = player;
	this.player2 = null;
  this.player1ID = id;
  this.player2ID
}

exports.find_match = function(socket, type){
  console.log(socket.id)
	var plyr = new player(socket.id, socket.handshake.session.user.elo,  socket.handshake.session.user.username, socket);
	var found = false;
	var index = 0;
		for(var i = 0; i < main.GAMES.length; i++){
				if(type == 0 && main.GAMES[i].type == 0){
					found = true;
					index = i;
				}else if(type == 0 && (plyr.elo - main.GAMES[i].player1.elo)*main.GAMES[i].type >= 0){
					found = true;
					index = i;
				}else if((main.GAMES[i].player1.elo - plyr.elo)*type >= 0 && main.GAMES[i].type == 0){
					found = true;
					index = i;
				}else if((main.GAMES[i].player1.elo - plyr.elo)*type >= 0 && (plyr.elo - main.GAMES[i].player1.elo)*main.GAMES[i].type >= 0){
					found = true;
					index = i;
				}
			}
			if(found){
        plyr.x = 100;
        plyr.facing = "left"
        main.GAMES[index].player2 = plyr;
        main.GAMES[index].player2ID = plyr.id;
        main.GAMES[index].player2.socket.emit("Game_start", main.GAMES[index].player1.name);
        main.GAMES[index].player1.socket.emit("Game_start", main.GAMES[index].player2.name);
				main.STARTED_GAMES.push(main.GAMES[index])
				main.GAMES.splice(index, 1);
			}else{
				plyr.x = 0;
				plyr.facing = "right"
				var game = new game_instance(plyr,type,plyr.id);
				main.GAMES.push(game);
				plyr.socket.emit('waiting')
			}
			console.log(main.GAMES.length)
}

exports.findplayer = function(array, id){
	 var index = array.map(function(e) { return e.player1ID; }).indexOf(id);
	 if(index != -1){
		 return{Player: "player1",NotPlayer:"player2",  index: index}
	 }else{
		 index = array.map(function(e) { return e.player2ID; }).indexOf(id);
	 }
	 if(index != -1){
		 return{Player: "player2",NotPlayer:"player1", index: index}
	 }else{
		 return -1;
	 }
}

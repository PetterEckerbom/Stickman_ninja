//takes in arrays and stuff from app.js
let main = require('./app.js');

//custructos below... pretty self explanatory
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
//this one is for the "wrap" that the players are in and pretty much whole game
function game_instance(player, type,id){
	this.type = type
	this.player1 = player;
	this.player2 = null;
  this.player1ID = id;
  this.player2ID
}

exports.find_match = function(socket, type){
	//start by createing a player (Needs to be done regardless of where it will end up)
	var plyr = new player(socket.id, socket.handshake.session.user.elo,  socket.handshake.session.user.username, socket);
	var found = false;
	var index = 0;
	//below we GAMES that have not yet been started, if elo request satisfied we save what game it is in "index"
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
			//if we found a game we give the player starting point and place him as "player2" in that game
			if(found){
        plyr.x = 100;
        plyr.facing = "left"
        main.GAMES[index].player2 = plyr;
        main.GAMES[index].player2ID = plyr.id;
				//we notefie the clients that the game has started and the opponents name, the rest the can figuer out on their own
        main.GAMES[index].player2.socket.emit("Game_start", main.GAMES[index].player1.name);
        main.GAMES[index].player1.socket.emit("Game_start", main.GAMES[index].player2.name);
				//we remove game from the queue and add it to games that have started
				main.STARTED_GAMES.push(main.GAMES[index])
				main.GAMES.splice(index, 1);
			}else{
				//if we didnt find a game we create a new one and save player as player1 in that game.
				plyr.x = 0;
				plyr.facing = "right"
				var game = new game_instance(plyr,type,plyr.id);
				main.GAMES.push(game);
				//we tell the client that we are waiting for an opponent
				plyr.socket.emit('waiting')
			}
			console.log(main.GAMES.length)
}

exports.findplayer = function(array, id){
	//checks if there are a player with a given id in a given array
	 var index = array.map(function(e) { return e.player1ID; }).indexOf(id);
	 if(index != -1){
		 //if there is a player in the array and it is set to player1 we return that as an object. (we also return the other player because why not?)
		 return{Player: "player1",NotPlayer:"player2",  index: index}
	 }else{
		 //if there are no player1 we check player2
		 index = array.map(function(e) { return e.player2ID; }).indexOf(id);
	 }
	 if(index != -1){
		 //if there is a player2 we do same thing as player1 but inverted
		 return{Player: "player2",NotPlayer:"player1", index: index}
	 }else{
		 //if no player found we return -1
		 return -1;
	 }
}

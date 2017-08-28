//takes in arrays and stuff from app.js
let main = require('./app.js');
var RankedQueue = [];
var CasualQueue = [];
var FriendQueue = {};
var STARTED_GAMES = [];
exports.STARTED_GAMES = STARTED_GAMES;
exports.RankedQueue = RankedQueue;
exports.CasualQueue = CasualQueue;
exports.FriendQueue = FriendQueue;

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

exports.find_ranked = function(socket, type){
	//start by createing a player (Needs to be done regardless of where it will end up)
	var plyr = new player(socket.id, socket.handshake.session.user.elo,  socket.handshake.session.user.username, socket);
	var found = false;
	var index = 0;
	//below we GAMES that have not yet been started, if elo request satisfied we save what game it is in "index"
		for(var i = 0; i < RankedQueue.length; i++){
				if(type == 0 && RankedQueue[i].type == 0){
					found = true;
					index = i;
				}else if(type == 0 && (plyr.elo - RankedQueue[i].player1.elo)*RankedQueue[i].type >= 0){
					found = true;
					index = i;
				}else if((RankedQueue[i].player1.elo - plyr.elo)*type >= 0 && RankedQueue[i].type == 0){
					found = true;
					index = i;
				}else if((RankedQueue[i].player1.elo - plyr.elo)*type >= 0 && (plyr.elo - RankedQueue[i].player1.elo)*RankedQueue[i].type >= 0){
					found = true;
					index = i;
				}
			}
			//if we found a game we give the player starting point and place him as "player2" in that game
			if(found){
        plyr.x = 100;
        plyr.facing = "left"
        RankedQueue[index].player2 = plyr;
        RankedQueue[index].player2ID = plyr.id;
				//we notefie the clients that the game has started and the opponents name, the rest the can figuer out on their own
        RankedQueue[index].player2.socket.emit("Game_start", RankedQueue[index].player1.name);
        RankedQueue[index].player1.socket.emit("Game_start", RankedQueue[index].player2.name);
				//we remove game from the queue and add it to games that have started
				STARTED_GAMES.push(RankedQueue[index])
				RankedQueue.splice(index, 1);
			}else{
				//if we didnt find a game we create a new one and save player as player1 in that game.
				plyr.x = 0;
				plyr.facing = "right"
				var game = new game_instance(plyr,type,plyr.id);
				RankedQueue.push(game);
				//we tell the client that we are waiting for an opponent
				plyr.socket.emit('waiting')
			}
			console.log(RankedQueue.length)
}
exports.find_casual = function(socket){
	//start by createing a player (Needs to be done regardless of where it will end up)
	var plyr = new player(socket.id, socket.handshake.session.user.elo,  socket.handshake.session.user.username, socket);
	var found = false;
	var index = 0;
	//below we GAMES that have not yet been started, if elo request satisfied we save what game it is in "index"
		for(var i = 0; i < CasualQueue.length; i++){
				if(CasualQueue[i].player2 == null){
					plyr.x = 100;
	        plyr.facing = "left"
	        CasualQueue[i].player2 = plyr;
	        CasualQueue[i].player2ID = plyr.id;
					//we notefie the clients that the game has started and the opponents name, the rest the can figuer out on their own
	        CasualQueue[i].player2.socket.emit("Game_start", CasualQueue[i].player1.name);
	        CasualQueue[i].player1.socket.emit("Game_start", CasualQueue[i].player2.name);
					//we remove game from the queue and add it to games that have started
					STARTED_GAMES.push(CasualQueue[i])
					CasualQueue.splice(i, 1);
					found = true;
				}
			}
			//if we found a game we give the player starting point and place him as "player2" in that game
				//if we didnt find a game we create a new one and save player as player1 in that game.
				if(!found){
					plyr.x = 0;
					plyr.facing = "right"
					var game = new game_instance(plyr,0,plyr.id);
					CasualQueue.push(game);
					//we tell the client that we are waiting for an opponent
					plyr.socket.emit('waiting');
				}
			console.log(CasualQueue.length)
}

exports.create_match_friend = function(socket, code){
	var plyr = new player(socket.id, socket.handshake.session.user.elo,  socket.handshake.session.user.username, socket);
		if(FriendQueue[code]){
			socket.emit('code_taken');
		}else{
			plyr.x = 0;
			plyr.facing = "right"
			var game = new game_instance(plyr,0,plyr.id);
			FriendQueue[code] = game;
			//we tell the client that we are waiting for an opponent
			plyr.socket.emit('waiting_friend', code);

		}
}

exports.find_match_friend = function(socket, code){
	//console.log(FriendQueue[code])
	var plyr = new player(socket.id, socket.handshake.session.user.elo,  socket.handshake.session.user.username, socket);
		if(FriendQueue[code]){
			FriendQueue[code].player2 = plyr;
			FriendQueue[code].player2ID = plyr.id;
			FriendQueue[code].player2.socket.emit("Game_start", FriendQueue[code].player1.name);
			FriendQueue[code].player1.socket.emit("Game_start", FriendQueue[code].player2.name);
			STARTED_GAMES.push(FriendQueue[code]);
			delete FriendQueue.code;
		}else{
			socket.emit('No_code')
		}
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

/*
This file contains everyhting related to creating matches and putting to searching
users together into a game. There are 3 duffrent types of games, ranked, casual and friend game.
ranked takes elo into account when matching players and wehn a game is won takes away elo from
loser and gives to winner, casul workes same way but just picks 2 people at random and doesnt
touch a players elo. Friend game matches two players up based on a code they send, this also
dont touch elo.
*/

//takes in arrays and stuff from app.js
var info = require('./information.js');
var gameclock = require('./game_clock.js');
var boxes = require('./boxes.js');
var physics = require('./physics.js')

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
	this.jumpready = true;
	this.x = 0;
	this.y = 100;
	this.x_speed = 0;
	this.y_speed = 0;
	this.max_speed = 12;
	this.dir = 0;
	this.friction = 0.2;
	this.accerelation = 0.6;
	this.gravity = 0.4;
	this.facing = null;
	this.action = "Idle";
	this.elo = elo;
	this.id = id;
	this.socket = socket;
	this.health = 1000;
	this.fame = 0;
	this.name = name;
	this.Ptime = {};
	this.ping = 0;
	this.controlE = true;
	this.attackready = true;
	this.touching_down = false;
	this.punch = {punch1: false, punch2: false};
	this.item = "nothing";
	this.charges = 0;
	this.wings = false;
	this.iceballhits = 0;
	this.attackstack = 0;
	this.controlstack = 0;
	this.fallen = false;
	this.lives = 3;
}
//this one is for the "wrap" that the players are in and pretty much whole game
function game_instance(player, type, id, ranked){
	if(!ranked){
		ranked = false;
	}
	this.ranked = ranked;
	this.type = type;
	this.players = [player];
  this.player1ID = id;
  this.player2ID = null;
	this.boxes = [];
	this.shurikens = [];
	this.bombs = [];
	this.iceballs = [];
	this.bananas = [];
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
				}else if(type == 0 && (plyr.elo - RankedQueue[i].players[0].elo)*RankedQueue[i].type >= 0){
					found = true;
					index = i;
				}else if((RankedQueue[i].players[0].elo - plyr.elo)*type >= 0 && RankedQueue[i].type == 0){
					found = true;
					index = i;
				}else if((RankedQueue[i].players[0].elo - plyr.elo)*type >= 0 && (plyr.elo - RankedQueue[i].players[0].elo)*RankedQueue[i].type >= 0){
					found = true;
					index = i;
				}
			}
			//if we found a game we give the player starting point and place him as "player2" in that game
			if(found){
        plyr.x = 1180;
        plyr.facing = "left";
        RankedQueue[index].players[1] = plyr;
        RankedQueue[index].player2ID = plyr.id;
				//we notefie the clients that the game has started and the opponents name, the rest the can figuer out on their own
        RankedQueue[index].players[1].socket.emit("Game_start", {you:RankedQueue[index].players[1].name, enemy: RankedQueue[index].players[0].name});
        RankedQueue[index].players[0].socket.emit("Game_start", {you:RankedQueue[index].players[0].name, enemy: RankedQueue[index].players[1].name});
				gameclock.sync(  RankedQueue[index].players[0],  RankedQueue[index].players[1]);
				//we remove game from the queue and add it to games that have started
				STARTED_GAMES.push(RankedQueue[index]);
				RankedQueue.splice(index, 1);
			}else{
				//if we didnt find a game we create a new one and save player as player1 in that game.
				plyr.x = 100;
				plyr.facing = "right";
				var game = new game_instance(plyr,type,plyr.id, true);
				RankedQueue[RankedQueue.length] = game;
				//we tell the client that we are waiting for an opponent
				plyr.socket.emit('waiting');
			}
};
exports.find_casual = function(socket){
	//start by createing a player (Needs to be done regardless of where it will end up)
	var plyr = new player(socket.id, socket.handshake.session.user.elo,  socket.handshake.session.user.username, socket);
	var found = false;
	var index = 0;
	//below we GAMES that have not yet been started, if elo request satisfied we save what game it is in "index"
		for(var i = 0; i < CasualQueue.length; i++){
				if(CasualQueue[i].players[1]  == null){
					plyr.x = 1180;
	        plyr.facing = "left";
	        CasualQueue[i].players[1] = plyr;
	        CasualQueue[i].player2ID = plyr.id;
					//we notefie the clients that the game has started and the opponents name, the rest the can figuer out on their own
	        CasualQueue[i].players[1].socket.emit("Game_start", {you:CasualQueue[i].players[1].name, enemy: CasualQueue[i].players[0].name});
	        CasualQueue[i].players[0].socket.emit("Game_start", {you:CasualQueue[i].players[1].name, enemy: CasualQueue[i].players[0].name});
					gameclock.sync(CasualQueue[i].players[0], CasualQueue[i].players[1]);
					//we remove game from the queue and add it to games that have started
					STARTED_GAMES.push(CasualQueue[i]);
					CasualQueue.splice(i, 1);
					found = true;
				}
			}
			//if we found a game we give the player starting point and place him as "player2" in that game
				//if we didnt find a game we create a new one and save player as player1 in that game.
				if(!found){
					plyr.x = 100;
					plyr.facing = "right";
					var game = new game_instance(plyr,0,plyr.id);
					CasualQueue[CasualQueue.length] = game;
					//we tell the client that we are waiting for an opponent
					plyr.socket.emit('waiting');
				}
			console.log(CasualQueue.length);
};

exports.create_match_friend = function(socket, code){
	var plyr = new player(socket.id, socket.handshake.session.user.elo,  socket.handshake.session.user.username, socket);
		if(FriendQueue[code]){
			socket.emit('code_taken');
		}else{
			plyr.x = 100;
			plyr.facing = "right";
			var game = new game_instance(plyr,0,plyr.id);
			FriendQueue[code] = game;
			//we tell the client that we are waiting for an opponent
			plyr.socket.emit('waiting_friend', code);

		}
};

exports.find_match_friend = function(socket, code){
	//console.log(FriendQueue[code])
	var plyr = new player(socket.id, socket.handshake.session.user.elo,  socket.handshake.session.user.username, socket);
	plyr.x = 1180;
	plyr.facing = "left";
		if(FriendQueue[code]){
			FriendQueue[code].players[1] = plyr;
			FriendQueue[code].player2ID = plyr.id;
			FriendQueue[code].players[1].socket.emit("Game_start", {you:FriendQueue[code].players[1].name, enemy: FriendQueue[code].players[0].name});
			FriendQueue[code].players[0].socket.emit("Game_start", {you:FriendQueue[code].players[0].name, enemy: FriendQueue[code].players[1].name});
			gameclock.sync(FriendQueue[code].players[0],FriendQueue[code].players[1]);
			STARTED_GAMES.push(FriendQueue[code]);
			delete FriendQueue.code;
		}else{
			socket.emit('No_code');
		}
};

var findplayer = function(array, id){
	//checks if there are a player with a given id in a given array
	 var index = array.map(function(e) { return e.player1ID; }).indexOf(id);
	 if(index != -1){
		 //if there is a player in the array and it is set to player1 we return that as an object. (we also return the other player because why not?)
		 return{Player: 0,NotPlayer:1,  index: index};
	 }else{
		 //if there are no player1 we check player2
		 index = array.map(function(e) { return e.player2ID; }).indexOf(id);
	 }
	 if(index != -1){
		 //if there is a player2 we do same thing as player1 but inverted
		 return{Player: 1,NotPlayer:0, index: index};
	 }else{
		 //if no player found we return -1
		 return -1;
	 }
};

exports.findplayer = findplayer;

exports.disconnect = function(socket){
	//start by calling fuckion that return in what game a user is based on socketid
	var queueR_check = findplayer(RankedQueue, socket.id);
	var games_check = findplayer(STARTED_GAMES, socket.id);
	var queueC_check = findplayer(CasualQueue, socket.id);
	//var queue_check = matchmaking.findplayer(matchmaking.RankedQueue, socket.id);
	if(queueR_check != -1){
		//If game had not started yet we just throw it away
		RankedQueue.splice(queueR_check.index, 1);
	}else if(games_check != -1){
		//if game had started we alert remaining user and throw the game away
		physics.game_end(STARTED_GAMES[games_check.index].players[games_check.NotPlayer], STARTED_GAMES[games_check.index].players[games_check.Player], games_check.index);
		//STARTED_GAMES[games_check.index].players[games_check.NotPlayer].socket.emit('Opponent_DC');
		STARTED_GAMES.splice(games_check.index, 1);
	}else if(queueC_check != -1){
		//if game had started we alert remaining user and throw the game away
		//matchmaking.CasualQueue[games_check.index][games_check.NotPlayer].socket.emit('Opponent_DC');
		CasualQueue.splice(games_check.index, 1);
	}else if(FriendQueue[socket.codeID]){
		if(FriendQueue[socket.codeID].player1ID == socket.id){
			delete FriendQueue[socket.codeID];
		}
	}
	console.log("Queue " + RankedQueue.length);
	console.log("Running games "+STARTED_GAMES.length);
};

//this function find the state a player is in, for example his hitbox is found in state
exports.setstate = function(){
	for(var i = 0; i < STARTED_GAMES.length; i++){
		for(var y = 0; y < 2; y++){
			//console.log(STARTED_GAMES[i].players[y].y + " " + STARTED_GAMES[i].players[y].x)
			if(STARTED_GAMES[i].players[y].fallen){
				STARTED_GAMES[i].players[y].state = info.states.down;
			}else if(STARTED_GAMES[i].players[y].y_speed < 0){
				STARTED_GAMES[i].players[y].state = info.states.jumping;
			}else if(STARTED_GAMES[i].players[y].y_speed > 0){
				STARTED_GAMES[i].players[y].state = info.states.falling;
			}else if(STARTED_GAMES[i].players[y].dir == 1 || STARTED_GAMES[i].players[y].dir == -1){
				STARTED_GAMES[i].players[y].state = info.states.running;
			}else if(STARTED_GAMES[i].players[y].dir == 0){
				STARTED_GAMES[i].players[y].state = info.states.idle;
			}
	}
}
};

exports.decrese_health = function(player, health){
	var game_index = findplayer(STARTED_GAMES, player.id);
	var otherplayer =  STARTED_GAMES[game_index.index].players[game_index.NotPlayer];
	player.health -= health;
	player.socket.emit('health_update', {health:player.health, player:0});
	otherplayer.socket.emit('health_update', {health:player.health, player:1});
	if(player.health < 0){
		player.health = 1000;
		player.socket.emit('healthup',0);
		otherplayer.socket.emit('healthup',1);
		player.dir = 0;
		player.controlstack++;
		player.controlE = false;
		setTimeout(gameclock.controlE_back, 5000, player);
		gameclock.sync(player, otherplayer);
	}
};
exports.fame_increase = function(player, fame){
	var game_index = findplayer(STARTED_GAMES, player.id);
	var otherplayer =  STARTED_GAMES[game_index.index].players[game_index.NotPlayer];
	player.fame += fame;
	if(player.fame >= 500){
		player.fame = player.fame - 500;
		boxes.create_box(game_index.Player, game_index.index);
	}
	player.socket.emit('fame_update', {fame:player.fame, player:0});
	otherplayer.socket.emit('fame_update', {fame:player.fame, player:1});
};

/*
This Document contains static data that is needed to play game, this is things such as
codinates for diffrent obsticles and platforms but also hitboxes for diffrent sates of players and such.
A very simular copy of this document can be found in the client in data.js this is because the client Needs
the same values as the server in order to accuratly predict what the servers calculations are doing.
*/
var platform = [
	//Left big bottom platform
	{
		xstart: 125,
		xend: 425,
		y:680,
		thickness:40
	},
	//Right big bottom platform
	{
		xstart: 855,
		xend: 1155,
		y:680,
		thickness:40
	},
	//Left thin platform
	{
		xstart: 300,
		xend: 440,
		y:490,
		thickness:20
	},
	//Right thin platform
	{
		xstart: 820,
		xend: 960,
		y:490,
		thickness:20
	},
	//Middle platform
	{
		xstart: 550,
		xend: 730,
		y:300,
		thickness:40
	},
	//Left spawning platform
	{
		xstart: 0,
		xend: 200,
		y:100,
		thickness:40
	},
	//Right Spawning platform
	{
		xstart: 1080,
		xend: 1280,
		y:100,
		thickness:40
	}
];

var walls = [
	//Left Bouncy wall
	{
		x:-75,
		ystart:350,
		yend:450,
		thickness:15,
		bouncy:true
	},
	//Right Bouncy wall
	{
		x:1340,
		ystart:350,
		yend:450,
		thickness:15,
		bouncy:true
	},
	//Middle wall
	{
		x:625,
		ystart:500,
		yend:600,
		thickness:15,
		bouncy:false
	},
	//Right Wall for left big bottom platform
	{
		x:410,
		ystart:680,
		yend:720,
		thickness:15,
		bouncy:false
	},
	//Left Wall for left big bottom platform
	{
		x:125,
		ystart:680,
		yend:720,
		thickness:15,
		bouncy:false
	},
	//Left Wall for right big bottom platform
	{
		x:855,
		ystart:680,
		yend:720,
		thickness:15,
		bouncy:false
	},
	//Right Wall for right big bottom platform
	{
		x:1140,
		ystart:680,
		yend:720,
		thickness:15,
		bouncy:false
	},
	//Left Wall for middle platform
	{
		x:550,
		ystart:300,
		yend:340,
		thickness:15,
		bouncy:false
	},
	//Right Wall for middle platform
	{
		x:715,
		ystart:300,
		yend:340,
		thickness:15,
		bouncy:false
	},
	//Right Wall for left spawn platform
	{
		x:185,
		ystart:100,
		yend:140,
		thickness:15,
		bouncy:false
	},
	//Left Wall for Right spawn platform
	{
		x:1080,
		ystart:100,
		yend:140,
		thickness:15,
		bouncy:false
	},
	//left Wall for left spawn platform
	{
		x:0,
		ystart:100,
		yend:140,
		thickness:15,
		bouncy:false
	},
	//Right Wall for right spawn platform
	{
		x:1265,
		ystart:100,
		yend:140,
		thickness:15,
		bouncy:false
	},
];

var jumppad =[
	//Jumppad on left big bottom platform
	{
		x:150,
		y:680,
		width:50
	},
	//Jumppad on right big bottom platform
	{
		x:1080,
		y:680,
		width:50
	},
	//Jumppad on left thin platform
	{
		x:410,
		y:490,
		width:30
	},
	//Jumppad on right thin platform
	{
		x:820,
		y:490,
		width:30
	},
	//Left jumppad on middle platform
	{
		x:550,
		y:300,
		width:20
	},
	//Right jumppad on middle platform
	{
		x:710,
		y:300,
		width:20
	},
];

//These are the diffrent satets a oplayer can be in!
var states = {
	jumping: {hitbox_W:100/3, hitbox_H:300/3},
	falling: {hitbox_W:100/3, hitbox_H:300/3},
	idle: {hitbox_W:100/3, hitbox_H:300/3},
	running: {hitbox_W:180/3, hitbox_H:310/3},
	down: {hitbox_W:100/3, hitbox_H:100/3},
};

exports.walls = walls;
exports.states = states;
exports.platforms = platform;
exports.jumppad = jumppad;

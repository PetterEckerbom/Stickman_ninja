//coordinates and data for platforms
var platform = [
	{
		xstart: 125,
		xend: 425,
		y:680,
		thickness:40
	},{
		xstart: 855,
		xend: 1155,
		y:680,
		thickness:40
	},{
		xstart: 300,
		xend: 440,
		y:490,
		thickness:20
	},{
		xstart: 820,
		xend: 960,
		y:490,
		thickness:20
	},{
		xstart: 550,
		xend: 730,
		y:300,
		thickness:40
	},{
		xstart: 0,
		xend: 200,
		y:100,
		thickness:40
	},{
		xstart: 1080,
		xend: 1280,
		y:100,
		thickness:40
	}
];

var walls = [
	{
		x:-75,
		ystart:350,
		yend:450,
		thickness:15,
		bouncy:true
	},
	{
		x:1340,
		ystart:350,
		yend:450,
		thickness:15,
		bouncy:true
	},
	{
		x:625,
		ystart:500,
		yend:600,
		thickness:15,
		bouncy:false
	},
	{
		x:410,
		ystart:680,
		yend:720,
		thickness:15,
		bouncy:false
	},
	{
		x:125,
		ystart:680,
		yend:720,
		thickness:15,
		bouncy:false
	},
	{
		x:855,
		ystart:680,
		yend:720,
		thickness:15,
		bouncy:false
	},
	{
		x:1140,
		ystart:680,
		yend:720,
		thickness:15,
		bouncy:false
	},
	{
		x:550,
		ystart:300,
		yend:340,
		thickness:15,
		bouncy:false
	},
	{
		x:715,
		ystart:300,
		yend:340,
		thickness:15,
		bouncy:false
	},
	{
		x:185,
		ystart:100,
		yend:140,
		thickness:15,
		bouncy:false
	},
	{
		x:1080,
		ystart:100,
		yend:140,
		thickness:15,
		bouncy:false
	},
	{
		x:0,
		ystart:100,
		yend:140,
		thickness:15,
		bouncy:false
	},
	{
		x:1265,
		ystart:100,
		yend:140,
		thickness:15,
		bouncy:false
	},
];


var animations = {
	idle: {frames:8, width:150, height:300, hitbox_W:100/3, hitbox_H:300/3, sprite:"idle", fps:100, maxframe:0},
	running: {frames:3, width:290, height:310, hitbox_W:180/3, hitbox_H:310/3, sprite:"running", fps:100, maxframe:0},
	falling: {frames:3, width:200, height:300, hitbox_W:100/3, hitbox_H:300/3, sprite:"falling", fps:1000/15, maxframe:0},
	jump: {frames:4, width:190, height:305, hitbox_W:100/3, hitbox_H:300/3, sprite:"jump", fps:1000/15, maxframe:0},
	punch1: {frames:22, width:410, height:305, hitbox_W:100/3, hitbox_H:300/3, sprite:"punch3", fps:1000/20, maxframe:22},
	punch2: {frames:10, width:350, height:300, hitbox_W:100/3, hitbox_H:300/3, sprite:"punch2", fps:1000/10, maxframe:10},
	punch3: {frames:22, width:410, height:305, hitbox_W:100/3, hitbox_H:300/3, sprite:"punch3", fps:1000/20, maxframe:22}
};

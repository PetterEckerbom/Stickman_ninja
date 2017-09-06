//coordinates and data for platforms
var platform = [
	{
		xstart: 50,
		xend: 500,
		y:680,
		thickness:40
	},{
		xstart: 780,
		xend: 1230,
		y:680,
		thickness:40
	},{
		xstart: 340,
		xend: 520,
		y:490,
		thickness:20
	},{
		xstart: 760,
		xend: 940,
		y:490,
		thickness:20
	},{
		xstart: 500,
		xend: 780,
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
		x:20,
		ystart:300,
		yend:500,
		thickness:15,
		bouncy:true
	},
	{
		x:1245,
		ystart:300,
		yend:500,
		thickness:15,
		bouncy:true
	},
	{
		x:485,
		ystart:680,
		yend:720,
		thickness:15,
		bouncy:false
	},
	{
		x:50,
		ystart:680,
		yend:720,
		thickness:15,
		bouncy:false
	},
	{
		x:780,
		ystart:680,
		yend:720,
		thickness:15,
		bouncy:false
	},
	{
		x:1215,
		ystart:680,
		yend:720,
		thickness:15,
		bouncy:false
	},
	{
		x:500,
		ystart:300,
		yend:340,
		thickness:15,
		bouncy:false
	},
	{
		x:765,
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
	idle: {frames:8, width:150, height:300, hitbox_W:100/3, hitbox_H:300/3, sprite:"idle", fps:100},
	running: {frames:3, width:290, height:310, hitbox_W:180/3, hitbox_H:310/3, sprite:"running", fps:100},
	falling: {frames:3, width:200, height:300, hitbox_W:100/3, hitbox_H:300/3, sprite:"falling", fps:1000/15}
};

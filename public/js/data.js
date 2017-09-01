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


var animations = {
	idle: {frames:8, width:150, height:300, hitbox_W:150, hitbox_H:300, sprite:"idle", fps:100},
	running: {frames:3, width:290, height:310, hitbox_W:290, hitbox_H:310, sprite:"running", fps:100},
}

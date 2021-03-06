//Initiate global varibles to store the animation flipping . so we can pause it.
var enemy_animation;
var you_animation;

//start those animations at 10fps
function startanimation(){
  enemy_animation = setInterval(flipframes_enemy, 1000/10);
  you_animation = setInterval(flipframes_you, 1000/10);
}
function flipframes_enemy(){
  //flip frames for enemt
  players[1].frame++;
  //if we have  alocked anymation we check if we excceeded maxframes and in thatcase we unlock.
  if(players[1].animationlock && players[1].frame >= players[1].animation.maxframe){
    players[1].animationlock = false;
  }
}
//same as above!
function flipframes_you(){
  players[0].frame++;
  if(players[0].animationlock && players[0].frame >= players[0].animation.maxframe){
    players[0].animationlock = false;
  }
}
function draw_map(){
  //Temp way of drawing map elements
  ctx.fillStyle="#ff0026";
  for(var i=0;i<platform.length;i++){
    var img = document.getElementById(platform[i].sprite);
    ctx.drawImage(img,platform[i].xstart+xoffset,platform[i].y+yoffset-platform[i].oveset-5);
  }
  ctx.fillStyle="#00f735";
  for(var y=0;y<walls.length;y++){
    if(walls[y].texture){
      var imgwall = document.getElementById(walls[y].texture);
      ctx.drawImage(imgwall, walls[y].x+xoffset, walls[y].ystart+yoffset);
    }
  }
}
function draw_players(){
  //sets fillstyle to blue to draw client name.
  ctx.fillStyle="#0000ff";
  ctx.font="20px Arial";
      for(var i = 0; i < 2; i++){
        //checks if it the red or blue sprite that should be drawn
      var color ="RED_";
      if(i == 0){
        color = "BLUE_";
      }
      //grab the sprite from HTML with direction, color and animation that is approprate.
     var sprite = document.getElementById(color+players[i].animation.sprite+"_"+players[i].facing);
     //This effectyvly is the varible for what part of the spritesheet should be drawn.
     var xcrop = (players[i].frame%players[i].animation.frames)*players[i].animation.width;
     var player_width = players[i].animation.width;
     var player_height = players[i].animation.height;
     //draws the playername right above where the hitbox ends in y axis and centered on the x
     ctx.textAlign="center";
     ctx.fillText(players[i].name,players[i].x+xoffset,players[i].y-players[i].animation.hitbox_H+yoffset-5);
     //drawn the player, uses all previos varibles but devides the hight and width by 3 as all sprites are made 3 time bigger then they should.
     ctx.drawImage(sprite,xcrop,0,player_width,player_height,players[i].x-((player_width/3)/2)+xoffset,players[i].y-(player_height/3)+yoffset,player_width/3,player_height/3);
     //sets fillstyle to red for nexttime it should write the enemy name.
      ctx.fillStyle="#ff0000";
   }
}
function draw_powerbar(){
  var img_bar = document.getElementById('powerbar');
  ctx.drawImage(img_bar,0,0,500-power,100,390+xoffset,700+yoffset,500-power,100);
}

function draw_boxes(){
  for(var i = 0; i < boxes.length; i++){
    var boxtype = "";
    if(boxes[i].type == "yours"){
      boxtype = document.getElementById('box_blue');
    }else if(boxes[i].type == "enemys"){
      boxtype = document.getElementById('box_red');
    }else{
      boxtype = document.getElementById('box_both');
    }
    ctx.drawImage(boxtype, boxes[i].cords.x+xoffset-25,boxes[i].cords.y+yoffset-50);
  }
}

function draw_shurikens(){
  for(var i = 0; i < shurikens.length; i++){
    var img = document.getElementById('shuriken');
    ctx.drawImage(img,shurikens[i].x+xoffset-12,shurikens[i].y+yoffset-12,24,24);
  }
}
function draw_bombs(){
  for(var i = 0; i < bombs.length; i++){
    var img = document.getElementById('bomb');
    ctx.drawImage(img,bombs[i].x+xoffset-21,bombs[i].y+yoffset-28);
  }
}
function draw_bananas(){
  for(var i = 0; i < bananas.length; i++){
    var img = document.getElementById('banana');
    ctx.drawImage(img,bananas[i].x+xoffset-15,bananas[i].y+yoffset-27);
  }
}

function draw_iceballs(){
  for(var i = 0; i < iceballs.length; i++){
    var img = document.getElementById('iceball');
    ctx.drawImage(img,iceballs[i].x+xoffset-16,iceballs[i].y+yoffset-16,32,32);
  }
}

//these functions take in an animation, sets the framerate to the correct speed and resets all frames in order to apply the correct animation.
function animation_change_you(animation){
  if(players[0].animation != animation && !players[0].animation_block ){
    clearInterval(you_animation);
    players[0].animation = animation;
    players[0].frames = 1;
    you_animation = setInterval(flipframes_you, animation.fps);
  }
}
function animation_change_enemy(animation){
  if(players[1].animation != animation && !players[1].animation_block ){
    clearInterval(enemy_animation);
    players[1].frames = 1;
    players[1].animation = animation;
    enemy_animation = setInterval(flipframes_enemy, animation.fps);
  }

}

//this animation looks at speed in diffrent axis and things like that in order to determin what animation should be playing
function find_animation(player){
  //if there is an animationlock it doesnt do anything. Animation lock is used for animations that cant be cancelled such as puch
  if(!player.animationlock){
    var animation_found;
    if(player.flipping){
      animation_found = animations.flip;
    }else if(player.y_speed > 0){
      animation_found = animations.falling;
    }else if(player.y_speed < 0){
      animation_found = animations.jump;
    }else if(player.dir == 0){
      animation_found = animations.idle;
    }else if(player.dir != 0){
      animation_found = animations.running;
    }

    //it calls the animationchange functions once it found the correct animation.
    if(players[0] == player){
      animation_change_you(animation_found);
    }else{
      animation_change_enemy(animation_found);
    }
  }
}

function UI(){
  var UI_hud_left = document.getElementById('UI_hud_left');
  var UI_hud_right = document.getElementById('UI_hud_right');
  var heart = document.getElementById('heart');
  if(UI_left_plr !== null){
    if(document.getElementById('main').height < 1070){
      draw_HUD_small();
      draw_toolbar_small();
    }else{
      draw_HUD_big();
      draw_toolbar_big();
    }
  }
}

function draw_HUD_small(){
  ctx.textAlign="left";
  var left_hp_pro = players[UI_left_plr].health/1000;
  var left_fame_pro = players[UI_left_plr].fame/500;
  var heart = document.getElementById('heart');
  ctx.drawImage(document.getElementById('profile_left_'+UI_left_plr),200+xoffset+5,5,44,39);
  ctx.fillStyle = '#00b300';
    ctx.fillRect(200+xoffset+57,33,243 * left_hp_pro,13);
  ctx.fillStyle = '#0099cc';
    ctx.fillRect(200+xoffset+57,54,243*left_fame_pro,13);
  ctx.drawImage(UI_hud_left,200+xoffset,0,300,75);
  ctx.fillStyle = '#000000';
  ctx.font = "17px Arial";
  ctx.fillText(players[UI_left_plr].name,300+xoffset,20);

  for(var i = 0; i < players[UI_left_plr].lives; i++){
    ctx.drawImage(heart,202+xoffset+(i*13),43,26,26);
  }

  var right_hp_pro = players[UI_right_plr].health/1000;
  var right_fame_pro = players[UI_right_plr].fame/500;
  ctx.drawImage(document.getElementById('profile_right_'+UI_right_plr),800+xoffset+251,5,44,39);
  ctx.fillStyle = '#00b300';
    ctx.fillRect(802+xoffset + (243*(1-right_hp_pro)),33,243*right_hp_pro,13);
  ctx.fillStyle = '#0099cc';
    ctx.fillRect(802+xoffset + (243*(1-right_fame_pro)),54,243*right_fame_pro,13);
  ctx.drawImage(UI_hud_right,800+xoffset,0,300,75);
  ctx.fillStyle = '#000000';
  ctx.font = "17px Arial";
  ctx.fillText(players[UI_right_plr].name,880+xoffset,20);
  for(var i = 0; i < players[UI_right_plr].lives; i++){
    ctx.drawImage(heart,1076+xoffset-(i*13),43,26,26);
  }
}
function draw_toolbar_small(){
  ctx.textAlign="center";
  var UI_toolbar = document.getElementById('UI_toolbar');
  ctx.drawImage(UI_toolbar,xoffset+340,document.getElementById('main').height -72,600,72);

  if(charges > 0){
    var item = document.getElementById(item_name);
    ctx.fillStyle="#000000";
    ctx.font="18px Arial";
    ctx.drawImage(item,xoffset+340+154,document.getElementById('main').height -72 + 17,38,38);
    ctx.fillText(charges+"",xoffset+340+200,document.getElementById('main').height -74+53);
  }

  ctx.textAlign="left";
  ctx.font="15px Arial";
  ctx.fillText("Ping: " + Math.round(ping),xoffset+340+472,document.getElementById('main').height - 72 + 36);
}

function draw_HUD_big(){
  ctx.textAlign="left";
  var left_hp_pro = players[UI_left_plr].health/1000;
  var left_fame_pro = players[UI_left_plr].fame/500;
  var heart = document.getElementById('heart');
  ctx.drawImage(document.getElementById('profile_left_'+UI_left_plr),xoffset-200+10,10);
  ctx.fillStyle = '#00b300';
    ctx.fillRect(xoffset-200+114,66,486 * left_hp_pro,26);
  ctx.fillStyle = '#0099cc';
    ctx.fillRect(xoffset-200+114,66+42,486*left_fame_pro,26);
  ctx.drawImage(UI_hud_left,xoffset-200,0);
  ctx.fillStyle = '#000000';
  ctx.font = "30px Arial";
  ctx.fillText(players[UI_left_plr].name,xoffset-200+180,40);

  for(var i = 0; i < players[UI_left_plr].lives; i++){
    ctx.drawImage(heart,xoffset-198+(i*27),88,50,50);
  }

  var right_hp_pro = players[UI_right_plr].health/1000;
  var right_fame_pro = players[UI_right_plr].fame/500;
  ctx.drawImage(document.getElementById('profile_right_'+UI_right_plr), document.getElementById('main').width - 400-xoffset+503,10);
  ctx.fillStyle = '#00b300';
    ctx.fillRect(document.getElementById('main').width - 400-xoffset + (486*(1-right_hp_pro)),66,486*right_hp_pro,26);
  ctx.fillStyle = '#0099cc';
    ctx.fillRect(document.getElementById('main').width - 400-xoffset + (486*(1-right_fame_pro)),66+42,486*right_fame_pro,26);
  ctx.drawImage(UI_hud_right,document.getElementById('main').width - 400-xoffset,0);
  ctx.fillStyle = '#000000';
  ctx.font = "30px Arial";
  ctx.fillText(players[UI_right_plr].name,document.getElementById('main').width - 265-xoffset,40);
  for(var i = 0; i < players[UI_right_plr].lives; i++){
    ctx.drawImage(heart,document.getElementById('main').width + 150 -xoffset-(i*27),88,50,50);
  }
}
function draw_toolbar_big(){
  ctx.textAlign="center";
  var UI_toolbar = document.getElementById('UI_toolbar');
  ctx.drawImage(UI_toolbar,xoffset+240,document.getElementById('main').height - 120);

  if(charges > 0){
    var item = document.getElementById(item_name);
    ctx.fillStyle="#000000";
    ctx.font="30px Arial";
    ctx.drawImage(item,xoffset+240+258,document.getElementById('main').height -120 + 28,64,64);
    ctx.fillText(charges+"",xoffset+240+334,document.getElementById('main').height - 120 + 85);
  }
  ctx.textAlign="left";
  ctx.font="25px Arial";
  ctx.fillText("Ping: " + Math.round(ping),xoffset+240+787,document.getElementById('main').height - 120 + 63);
}

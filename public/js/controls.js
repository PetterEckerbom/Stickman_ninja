//Stores what keys are up and which are down
var left = false;
var right = false;
var jump = true;

var down_down = false;
var up_down = false;

onkeydown = onkeyup = function(e){
  //If A or D are pressed or unpressed we change their status to true or false and calls move_change
  if(e.keyCode == 68){
    right = e.type == 'keydown';
    move_change();
  }
  if(e.keyCode == 65){
    left = e.type == 'keydown';
    move_change();
  }
  if(e.keyCode == 83){
    down_down = e.type == 'keydown';
  }
  if(e.keyCode == 87){
    up_down = e.type == 'keydown';
  }
  //if space is pressed we check if it was firts time and in that case we tell server
  if(e.keyCode == 32){
    if(jump){
     socket.emit('jump');
    }
    jump = e.type == 'keyup';
  }
  //if "K" is unpressed we tell the server to punch
  if(e.keyCode == 75 && e.type == 'keyup'){
    socket.emit('punch', down_down);
  }
  if(e.keyCode == 76 && e.type == 'keyup'){
    socket.emit('kick', down_down);
  }
};
//this function calculates what direction we want to move in and emits result to server.
function move_change(){
  var local_move;
  if(right && !left){
    local_move = 1;
  }else if(!right && left){
    local_move = -1;
  }else if(right && left){
    local_move = 0;
  }else if(!right && !left){
    local_move = 0;
  }
  if(local_move != players[0].dir){
    socket.emit('move', local_move);
  }
}

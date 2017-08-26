var socket = io();

socket.on("waiting",function(name){
  document.getElementById('wrap').innerHTML ="<img src='img/loading.png' id='loading'/><br><br><br><br>Looking for opponent..."
})
socket.on("Game_start",function(name){
  console.log('you are now in a game with '+name);
  document.getElementById('matchmaking').innerHTML="";
  document.getElementById('matchmaking').style.width ="none"
  document.getElementById('matchmaking').style.width ="0"
  document.getElementById('matchmaking').style.height ="0"
  document.getElementById('matchmaking').style.background ="none"
});
function match(){
  if(document.getElementById("ranked").checked){
    socket.emit('match_making', document.getElementById("chooseElo").value);
  }
}

function casualSel(){
  document.getElementById("chooseElo").innerHTML ="";
}
function rankedSel(){
  document.getElementById("chooseElo").innerHTML ='<select id="Elo" name="elo">  <option value="0">Any (fast queue time)</option><option value="1">Better elo than me</option><option value="-1">Worse elo than me</option> </select>';
}

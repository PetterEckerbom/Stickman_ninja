var socket = io();

//When server doen't find a match at first we tell client to wait by displaing text and a image that spinns from css
socket.on("waiting",function(name){
  document.getElementById('wrap').innerHTML ="<img src='img/loading.png' id='loading'/><br><br><br><br>Looking for opponent..."
});

//When server says game should start we remve matchmaking div
socket.on("Game_start",function(name){
  console.log('you are now in a game with '+name);
  document.getElementById('matchmaking').innerHTML="";
  document.getElementById('matchmaking').style.width ="none"
  document.getElementById('matchmaking').style.width ="0"
  document.getElementById('matchmaking').style.height ="0"
  document.getElementById('matchmaking').style.background ="none"
});

//when match() is called we emit to server that we wanna play
function match(){
  if(document.getElementById("ranked").checked){
    socket.emit('match_making', document.getElementById("Elo").value);
  }
}

//These two are for hiding or showing elo selector based on what gamemode player choose
function casualSel(){
  document.getElementById("chooseElo").innerHTML ="";
}
function rankedSel(){
  document.getElementById("chooseElo").innerHTML ='<select id="Elo" name="elo">  <option value="0">Any (fast queue time)</option><option value="1">Better elo than me</option><option value="-1">Worse elo than me</option> </select>';
}

//When socket says opponent disconnected we simply tell the user what happended. This will be updated
socket.on("Opponent_DC",function(){
  alert("Your Opponent ran like a chicken! You won the game");
});

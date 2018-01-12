window.onresize = window.onload = function(){
  document.getElementById("chatmessages").style.height = (window.innerHeight*0.55)+"px";
  document.getElementById("newsbox").style.height = (window.innerHeight*0.55)+"px";
}
var socket = io();
socket.emit('Join_chat');
socket.on('Get_message', function(data){
  document.getElementById('chatlist').innerHTML += "<li> <b>" + data.name +":</b> "+ data.msg + "</li><br>";
});

function send_in_chat(){
  var message = document.getElementById("txtinput").value;
  document.getElementById("txtinput").value = "";
  socket.emit('Send_message', message);
}

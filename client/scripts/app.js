var username = window.location.search.substring(10).replace(/%20/g, ' ');
var currentRoom = 'Lobby';
var running;
var keysList = [];

var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  username: '',
  rooms: [],
  friends: [],
  messages: [],
  init: function(){

  },
  send: function(message){
    console.log(message + "  :  message");
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        $('#comment').val('');

      },
      error: function (data) {
        console.log('chatterbox: Message failed to send .... ' + data);
      }
    });
  },

  fetch: function(){
    $.ajax({
      url: this.server,
      type: 'GET',
      data: {'order': '-createdAt'},
      contentType: 'json',
      success: function(data){
        console.log('chatterbox: Message retrieved');
        handleMessages(data.results);
      },
      error: function(data){
        console.log('chatterbox: Could not find message');
      }
    })
  },

  clearMessages: function(){
    $('#chats').children().remove();
  },

  renderMessage: function(text){
    var $node = $('<p>' + text + '</p>');
    $('#chats').append($node);
  },

  renderRoom: function(roomName) {
    var $room = $('<p>' + roomName + '</p>');
    $('#roomSelect').prepend($room);
  },

  handleUsernameClick: function(name) {
    if(!this.friends.includes(name)) {
      this.friends.push(name);
      var $friend = $('<li><a href="#">' + name + '</a></li>');
      $('.friends').append($friend);

    }

    console.log($('#messages').find())

    for(var i = 0; i < $('#messages').children().length; i++ ) {
      console.log($('#messages').children()[i])
      if(name && name === $('#messages').children()[i].children.username.innerText) {
        var n = $('#messages').children()[i];
        $(n).css('background-color', '#D7B19E');
      }
    }
  },

  handleRooms: function(room) {
    if(!this.rooms.includes(room)) {
      this.rooms.push(room);
      var $room = $('<li id="room"><a href="#">' + room + '</a></li>');
      $('.rooms').append($room);

      var myRoom = room;
      $($room).click( function() {
        currentRoom = room;
        console.log('click: ' + room);
        filterRoom(room);

      });

    }
  },

  addRoom: function(room){
    if(this.rooms.includes(room)){
      alert('this room is already created');
    }
    currentRoom = room;
    this.rooms.push(room);

  }

}

$(document).ready(function() {
  app.fetch();
  $('.username').click( function() {
    app.handleUsernameClick();

  });

  $('.send-message').click( function() {
    var obj = {text: $('#comment').val(), roomname: currentRoom, username: username};
    app.send(obj);
  });
  $('#lobby').click( function() {
    clearTimeout(running);
    currentRoom = 'Lobby';
    filterRoom('Lobby');
  });
  $('#newroom').click( function() {
    var roomname = window.prompt('Please enter new room name', 'new room');
    app.addRoom(roomname)
    app.renderRoom(roomname)
  })
});

var refresh = function(results){
  //console.log(results);

  clearTimeout(running);

  _.each(results, function(result){

    var $board = $('<div class="well"><div class="row" id="username">' + xssFilters.inHTMLData(result.username) +
      '</div >\n<div class="row" id="message-text">' +
      xssFilters.inHTMLData(result.text) + '</div></div>');
    if(filterMessage(result)){
      $('#messages').prepend($board);
    }

    $('#username').on('click', function(evt) {
      app.handleUsernameClick($(this)[0].innerText);

      $('.' + this.username).next().css( "font-weight", "bold" );
    });

  });

  running = setTimeout((function(){app.fetch()}), 2000);

};
var handleMessages = function(messages) {

  var results = [];
  _.each(messages, function(message){

    if(!keysList.includes(message.objectId)){
      app.messages.unshift(message);
      keysList.push(message.objectId);
      results.push(message);
      app.handleRooms(message.roomname);
    }
  });


  refresh(results);
}

var filterRoom = function(room) {
  clearTimeout(running);
  $('#messages').empty();

  var results = [];
  // console.log(room);
  if(room === 'Lobby') {
    console.log("In lobby");
    _.each(app.messages, function(message) {
      results.push(message);
    });
  } else {
    results = _.filter(app.messages, function(message){
      return message.roomname === room;
    });
  }

  refresh(results);
}

var filterMessage = function(message){
  if(currentRoom === 'Lobby') return true;
  return message.roomname === currentRoom;
}

var turnOnRoom = function() {

}







var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  rooms: {},
  friends: [],
  messages: {},
  init: function(){

  },
  send: function(message){
    console.log(message + "  :  message");
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'json',
      success: function (data) {
        console.log('chatterbox: Message sent');
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
      contentType: 'json',
      success: function(data){
        console.log('chatterbox: Message retrieved');
        console.log(data + " success");
        // return data.results;
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
    $('#roomSelect').append($room);
  },

  handleUsernameClick: function(name) {
    if(!friends.includes(name)) {
      this.friends.push(name);
    }
  },

  addMessage: function(){


  }

}

$(document).ready(function() {
  refresh();
  $('.username').click( function() {
    app.handleUsernameClick();
  })

  $('.send-message').click( function() {
    console.log('hit');

    app.send($('#comment').val());
  })
});

var results;
var refresh = function(){

  promise.then(function(output) {
    results = output; // "Stuff worked!"
  }, function(err) {
    console.log(err); // Error: "It broke"
  });

  //var results = Promise.resolve('success').then(app.fetch());

  console.log(JSON.stringify(results) + " failed");

  _.each(results, function(result){
    console.log('in each')
    var $board = $('<div class="well">' + xssFilters.inHTMLData(result.text) + '</div>');
    $('#messages').append($board);
  });

  setTimeout((function(){refresh()}), 2000);
}

var promise = new Promise(function(resolve, reject) {
  app.fetch();

  if (app.fetch()) {
    resolve(results);
  }
  else {
    reject(Error("It broke"));
  }
});

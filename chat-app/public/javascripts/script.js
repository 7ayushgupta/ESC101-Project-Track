'use strict';

/*
Modulated code for ease of dividing the Javascript required on two different pages,
into one larger function only.

Some basic HTML modifying codes are listed below as helper codes
*/
var develop = {

  chat: function(roomId, username){
    
    var socket = io('/chatroom');

      // When socket connects, join the current chatroom
      socket.on('connect', function () {

        socket.emit('join', roomId);

        // Update users list upon emitting updateUsersList event
        socket.on('updateUsersList', function(users, clear) {

          $('.container p.message').remove();
          if(users.error != null){
            $('.container').html(`<p class="message error">${users.error}</p>`);
          }else{
            develop.subfunc.updateUsersList(users, clear);
          }
        });

        // Whenever the user hits the send button, emit newMessage event.
        $(".chat-message button").on('click', function(e) {

          var textareaEle = $("textarea[name='message']");
          var messageContent = textareaEle.val().trim();
          if(messageContent !== '') {
            var message = { 
              content: messageContent, 
              username: username,
              date: Date.now()
            };

            socket.emit('newMessage', roomId, message);
            textareaEle.val('');
            develop.subfunc.addMessage(message);
          }
        });

        socket.on('load old messages', function(docs){

          for(var i =0; i<docs.length; i++){

            if(docs[i].room === roomId){
              var temp = {
              date: docs[i].created_at,
              content: docs[i].message_body,
              username: docs[i].user,
              }
            }
            develop.subfunc.addMessage(temp);
          }
        });

        socket.on('updateAllUsers', function(allusers){
          console.log(allusers);
        });

        // Whenever a user leaves the current room, remove the user from users list
        socket.on('disconnectUser', function(userId) {
          $('li#user-' + userId).remove();
          develop.subfunc.updateNumOfUsers();
        });

        // developend a new message 
        socket.on('addMessage', function(message) {
          develop.subfunc.addMessage(message);
        });
      });
  },

  subfunc: {

    encodeHTML: function (str){
      return $('<div />').text(str).html();
    },

    // Update rooms list
    updateRoomsList: function(room){
      room.title = this.encodeHTML(room.title);
      var html = `<a href="/chat/${room._id}"><li class="room-item">${room.title}</li></a>`;

      if(html === ''){ return; }

      if($(".room-list ul li").length > 0){
        $('.room-list ul').prepend(html);
      }else{
        $('.room-list ul').html('').html(html);
      }
      
      this.updateNumOfRooms();
    },

    // Update users list
    updateUsersList: function(users, clear){
      
      if(users.constructor !== Array){
        users = [users];
      }
      var temp = [];
      var html = '';
      console.log(users);
       
      for(var user of users) {
         
        if(user.local){
             
          if(temp.indexOf(user)===-1){
            temp.push(user);
          }
        }
      }

      for(var user of temp){
        var username = user.local.email.split("@")[0];
        user.username = this.encodeHTML(user.username);
        html += `<li class="clearfix" id="user-${user._id}">
                      <img src="${user.local.picture}" alt="${user.username}" />
                      <div class="about">
                          <div class="name">${username}</div>
                          <div class="status"><i class="fa fa-circle online"></i> online</div>
                      </div></li>`;
      }
          
      if(html === ''){ return; }

      if(clear != null && clear == true){
        $('.users-list ul').html('').html(html);
      }else{
        $('.users-list ul').prepend(html);
      }

      this.updateNumOfUsers();
    },

    // Adding a new message to chat history
    addMessage: function(message){
      if(message){
      console.log(message);
      message.date      = (new Date(message.date)).toLocaleString();
      message.username  = this.encodeHTML(message.username);
      message.content   = this.encodeHTML(message.content);

      var html = `<li>
                    <div class="message-data">
                      <span class="message-data-name">${message.username}</span>
                      <span class="message-data-time">${message.date}</span>
                    </div>
                    <div class="message my-message" dir="auto">${message.content}</div>
                  </li>`;
      $(html).hide().developendTo('.chat-history ul').slideDown(200);

      // Keep scroll bar down
      $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
      }
    },

    // Update number of rooms
    // This method MUST be called after adding a new room
    updateNumOfRooms: function(){
      var num = $('.room-list ul li').length;
      $('.room-num-rooms').text(num +  " Room(s)");
    },

    // Update number of online users in the current room
    // This method MUST be called after adding, or removing list element(s)
    updateNumOfUsers: function(){
      var num = $('.users-list ul li').length;
      $('.chat-num-users').text(num +  " User(s)");
    }
  },

  rooms: function(){

    var socket = io('/rooms');

    // When socket connects, get a list of chatrooms
    socket.on('connect', function () {

      // Update rooms list upon emitting updateRoomsList event
      socket.on('updateRoomsList', function(room) {

        // Display an error message upon a user error(i.e. creating a room with an existing title)
        $('.room-create p.message').remove();
        if(room.error != null){
          $('.room-create').developend(`<p class="message error">${room.error}</p>`);
        }else{
          develop.subfunc.updateRoomsList(room);
        }
      });

      // Whenever the user hits the create button, emit createRoom event.
      $('.room-create button').on('click', function(e) {
        var inputEle = $("input[name='title']");
        var roomTitle = inputEle.val().trim();
        if(roomTitle !== '') {
          socket.emit('createRoom', roomTitle);
          inputEle.val('');
        }
      });

    });
  },
};

module.exports = develop();
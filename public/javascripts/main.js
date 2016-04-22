require.config({
  baseUrl: '/javascripts',
  paths : {
    'socket.io' : '//cdn.socket.io/socket.io-1.4.5' 
  },
  shim: {
    'socket.io' : {
      exports : 'io'
    }
  }
});

require(['socket.io', 'window', 'document'], function (io, win, doc) {
  'use strict';

  var socket = io.connect(win.location.href)
  socket.on('servermessage', function (msg) {
    var element = doc.getElementById('random');
    element.innerHTML = msg;
  });
});

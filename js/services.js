var jirallo=angular.module('jirallo.socket', [ 'ngRoute', 'ui.router', 'angoose.client' ,'jirallo.loginCtrl', 'jirallo.tickets', 'jirallo.comment', 'jirallo.socket']);
jirallo.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
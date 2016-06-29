'use strict';
var jirallo = angular.module('jirallo.comment', ['ngDialog']);
// commentCtrl Controller to get data to create comment. 
// http call on /private/newcomment
// Alert error 
// Alert Well added + quit ngDialog view.
jirallo.controller('commentCtrl', function($scope, $rootScope, $state, $window, $http, $location, ngDialog){
  var CredNotProvided = "You are missing something. Please make sure you provided a Summary for the ticket.";
  $scope.submit = function () {
    if ($scope.ticket.summary) {
      $http({
        method: 'POST',
        url: '/private/newcomment',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {
          ticket_name: $scope.ticket.summary ,
          content: $scope.content
        }
      }).success(function(res) {
        $window.alert(res.message);
        $scope.state.reload($scope.base_state);
        $scope.ngDialog.close();
      });
    } else {
      $window.alert(CredNotProvided);
    }
  }
});

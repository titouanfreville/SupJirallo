// ProductOwner
'use strict';
var jirallo = angular.module('jirallo.loginCtrl', ['angoose.client']);
jirallo.controller('loginForm', ['$scope', '$window', '$http', 'ProductOwner', 'User', 'Developer', function($scope, $window, $http, ProductOwner, User, Developer){

  var CredNotProvided = "You are missing something. Please make sure you provided both User name and Password.";
  $scope.userName='Marsu';
  $scope.userPass='mars';

  $scope.submit = function () {
    if ($scope.userName && $scope.userPass) {
      $http({
        method: 'POST',
        url: '/signin',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {name: $scope.userName , password: $scope.userPass}
      }).success(function() {
        $window.location.href = '/private/';
      });
    } else {
      $window.alert(CredNotProvided);
    }
  }
}]);

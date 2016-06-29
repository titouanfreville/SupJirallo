// ProductOwner
'use strict';
var jirallo = angular.module('jirallo.loginCtrl', ['ngCookies']);
// LoginController
// Perform all required step to user.
// go to logged state if well login
// alert for error else
jirallo.controller('loginForm', ['$scope', '$rootScope', '$state', '$window', '$http', '$location', function($scope, $rootScope, $state, $window, $http, $location){
  var CredNotProvided = "You are missing something. Please make sure you provided both User name and Password.";
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
      }).success(function(res) {
        if (res.success) {
          $rootScope.userName=$scope.userName;
          $window.sessionStorage.setItem('userName', $scope.userName);
          $rootScope.userRole=res.role;
          $window.sessionStorage.setItem('userRole', res.role);
          $state.go('logged');
        }
        else {
          $window.alert(res.message);
        }
      });
    } else {
      $window.alert(CredNotProvided);
    }
  }
}]);

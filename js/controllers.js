// ProductOwner
'use strict';
var jirallo = angular.module('jirallo', [])
jirallo.controller('loginForm', ['$scope', 'ProductOwner', 'User', 'Developer', function($scope, ProductOwner, User, Developer){
  console.log(ProductOwner.$get({'name': 'Marsu'}));
  $scope.userName='Marsu';
  $scope.userPass='Rien';
}]);

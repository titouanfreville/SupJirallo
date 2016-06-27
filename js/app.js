/**
* @ngdoc overview
* @name InApp Billing Module
* @author Christophe Eble <ceble@nexway.com>
* @author Titouan Freville <tfreville@nexway.com>
* @description Main module for InApp Billing
*
* @usage
*
* ```
* #/{GUID}
* ```
*/
/* jshint +W097 */
'use strict';
/*jshint -W097 */
var jirallo=angular.module('jirallo', [ 'ngRoute', 'ui.router', 'jirallo.loginCtrl', 'jirallo.tickets']);
/*
jirallo.config(function($routeProvider) {
  $routeProvider
    // Main State
    .when('/', {
      templateUrl: 'main_view.html'
    })

    .when('/private', {
      templateUrl: 'private/index.html'
    })
})
*/
jirallo.config(function ($stateProvider, $urlRouterProvider, $routeProvider) {
  // $urlRouterProvider.when('/', '/index').when('/index.html', '/index');
  $stateProvider
    // Main State
    .state('jiralo', {
      url: '',
      templateUrl: 'main_view.html'
     })

  .state('index', {
      url: '/index',
      templateUrl: 'main_view.html'
    })

  .state('logged', {
      url: '/logged',
      templateUrl: 'private/index.html'
    });

  $urlRouterProvider.otherwise('')
})

jirallo.controller('indexController',['$rootScope', '$scope', '$window', '$state', function($rootScope, $scope, $window, $state) {
  console.log('States Found :  ' + angular.toJson($state.get()))
  if ($rootScope.userName) {
    $scope.userName=$rootScope.userName;
  } else {
    $scope.userName=$window.localStorage.userName;
  }
}]);

jirallo.controller('logoutCtrl', ['$scope', '$window', '$rootScope', '$state', function($scope, $window, $rootScope, $state) {
  $scope.destroy = function() {
    $rootScope.name=null;
    $window.localStorage.name=null;
    $state.go('index');
  }
}])
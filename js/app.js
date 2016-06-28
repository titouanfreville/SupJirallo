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
var jirallo=angular.module('jirallo', [ 'ngRoute', 'ui.router', 'angoose.client' ,'jirallo.loginCtrl', 'jirallo.tickets']);
jirallo.config(function ($stateProvider, $urlRouterProvider, $routeProvider) {
  $stateProvider
    .state('jiralo', {
      url: '',
      controller: 'mainCtrl',
      templateUrl: 'main_view.html'
     })

    .state('index', {
      url: '/index',
      controller: 'mainCtrl',
      templateUrl: 'main_view.html'
    })

    .state('logged', {
      url: '/logged',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
      },
      controller: 'mainCtrl',
      templateUrl: 'private/index.html'
    })

    .state('listtickets', {
      url: '/listtickets',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
      },
      controller: 'mainCtrl',
      templateUrl: 'private/show.html'
    })

    .state('addticket', {
      url: '/addticket',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
        var ispo;
        if ($rootScope.userRole) ispo = ($rootScope.userRole == 'ProductOwner')
        else {
          if ($window.sessionStorage.userName) ispo = ($window.sessionStorage.userRole == 'ProductOwner');
        }
        console.log(ispo);
        if (ispo == false) {
          $window.alert('You are not allowed to access this space');
          $state.go('logged');
        }
      },
      controller: 'mainCtrl',
      templateUrl: 'private/add.html'
    })
  ;

  $urlRouterProvider.otherwise('/index');
})

jirallo.controller('mainCtrl',['$rootScope', '$scope', '$window', '$state', function($rootScope, $scope, $window, $state) {
  if ($rootScope.userName) $scope.userName = $rootScope.userName
  else $scope.userName = $window.sessionStorage.userName;
  $scope.logged = angular.isDefined($scope.userName);
  if ($rootScope.userRole) $scope.ispo = ($rootScope.userRole == 'ProductOwner')
  else $scope.ispo = ($window.sessionStorage.userRole == 'ProductOwner');
}]);

jirallo.controller('logoutCtrl', ['$scope', '$window', '$rootScope', '$state', function($scope, $window, $rootScope, $state) {
  $scope.destroy = function() {
    $rootScope.userName=null;
    $window.sessionStorage.clear();
    $state.go('index');
  }
}])